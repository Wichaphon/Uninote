import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN || '7d',
    }
  );
};

//ตอน approveดปลี่ยนrole user เป็น seller อย่าลืมบังคับ logout 