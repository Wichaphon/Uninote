import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';
import { SALT_ROUNDS } from '../config/env.js';
import { validateEmail } from '../utils/validators.js';

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        if(!Boolean(validateEmail(email))) {
            return res.status(400).json({error: 'Invalid email format.'});
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const rounds = Number.parseInt(SALT_ROUNDS)
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
            message: 'Registration successful.',
            user,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed from authController.' });
    }
};