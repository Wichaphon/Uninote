import express from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

//Protected routes
router.post("/logout", authenticate, logout);

export default router;

