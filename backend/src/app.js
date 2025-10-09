import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import sellerRoutes from './routes/seller.route.js';

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: (process.env.DEV || "http://localhost:5000").split(","),
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seller", sellerRoutes);

app.listen(PORT, () => {
    console.log(`Server run on PORT : ${PORT}`)
    console.log(`Protected cors use only : ${process.env.DEV}`)
});


