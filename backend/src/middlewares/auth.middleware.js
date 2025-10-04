import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please log in.' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    //เช็ค access token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Access token has expired.',
          code: 'TOKEN_EXPIRED' 
        });
      }
      return res.status(401).json({ error: 'Invalid token.' });
    }

    //เช็คว่าไม่ใช่ access token ปลอม
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Please provide an access token.' });
    }
    
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };
    
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { isActive: true },
    });

    if (!userExists || !userExists.isActive) {
      return res.status(401).json({ error: 'User not found or account suspended.' });
    }

    next();
  } 
  
  catch (error) {
    console.error(`Authentication error: ${error} | fromauthMiddleware`);
    return res.status(500).json({ error: 'An error occurred during authentication.' });
  }
};