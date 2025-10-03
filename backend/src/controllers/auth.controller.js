import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { generateAccessToken, generateRefreshToken, saveRefreshToken, } from "../lib/jwt.js";
import { SALT_ROUNDS, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN } from "../config/env.js";
import { validateEmail } from "../utils/validators.js";

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    if (!Boolean(validateEmail(email))) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const rounds = Number.parseInt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, rounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Registration successful.",
      user,
    });
  } catch (error) {
    console.error(`Register error: ${error} | from authController`);
    res.status(500).json({ error: "Registration failed." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });}

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ error: "Your account has been suspended." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken(refreshToken, user.id);

    const decoded = jwt.decode(refreshToken);
    const maxAge = Math.max(0, decoded.exp * 1000 - Date.now());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      path: "/api/auth", 
      maxAge,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    });
  } catch (error) {
    console.error(`Login error: ${error} | from authController`);
    res.status(500).json({ error: "Login failed." });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required.' });
    }

    //เช็ค refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    //เช็คว่าเป็น refresh token จริง
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type.' });
    }

    //เช็คว่า refresh token อยู่ใน db ไหม
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!tokenRecord) {
      return res.status(401).json({ error: 'Refresh token is invalid' });
    }

    if (!tokenRecord.user.isActive) {
      return res.status(403).json({ error: 'Your account has been suspended.' });
    }

    //สร้างaccess token ใหม่
    const newAccessToken = generateAccessToken(tokenRecord.user);

    res.json({
      accessToken: newAccessToken,
      tokenType: 'Bearer',
      expiresIn: ms(JWT_ACCESS_EXPIRES_IN) / 1000, //แปลงเป็น ms
    });
  } catch (error) {
    console.error(`Refresh token error: ${error} | from authController`);
    res.status(500).json({ error: 'Failed to refresh token.' });
  }
}
