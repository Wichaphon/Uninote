import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createPurchase, getMyPurchases } from "../controllers/purchase.controller.js";
import { validatePagination } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/:sheetId", authenticate, createPurchase);

router.get("/my/purchases", authenticate, validatePagination, getMyPurchases);

export default router;