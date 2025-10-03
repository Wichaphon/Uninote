import { JWT_ACCESS_EXPIRES_IN, JWT_SECRET, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET } from '../config/env.js';
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      type: 'access',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN || '15m',
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );
};

export const saveRefreshToken = async (token, userId) => {
  const decoded = jwt.decode(token);
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });
};

//ตอน approveดปลี่ยนrole user เป็น seller อย่าลืมบังคับ logout 