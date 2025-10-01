import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};