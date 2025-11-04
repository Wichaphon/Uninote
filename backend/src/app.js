import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import sellerRoutes from './routes/seller.route.js';
import sheetRoutes from './routes/sheet.route.js';
import purchaseRoutes from './routes/purchase.route.js';
import adminRoutes from './routes/admin.route.js';
import reviewRoutes from './routes/review.route.js';

import { stripeWebhook } from './controllers/purchase.controller.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "../.env" });
}

const PORT = process.env.PORT;

const app = express();

app.post('/api/purchases/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

//CORS production
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

//Health check 
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);


//Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server run on PORT : ${PORT}`)
    console.log(`Protected cors use only : ${allowedOrigins.join(', ')}`)
    console.log(`Environment: ${process.env.NODE_ENV}`);
});


