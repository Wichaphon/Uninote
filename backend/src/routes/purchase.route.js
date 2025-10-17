import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createPurchase } from "../controllers/purchase.controller.js";

const router = express.Router();

router.post("/:sheetId", authenticate, createPurchase);

export default router;