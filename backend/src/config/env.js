import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../.env' });
}

export const JWT_SECRET = process.env.JWT_SECRET; 
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export const NODE_ENV = process.env.NODE_ENV;

export const SALT_ROUNDS = process.env.SALT_ROUNDS;

//cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

//Avatar
export const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL;

//Stripe
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;   
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

//Frontend URL
export const FRONTEND_URL = process.env.FRONTEND_URL;


