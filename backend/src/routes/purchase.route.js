import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { checkPurchaseStatus, createPurchase, downloadPurchasedSheet, getMyPurchases, getMySales } from "../controllers/purchase.controller.js";
import { validatePagination } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/:sheetId", authenticate, createPurchase);

router.get("/my/purchases", authenticate, validatePagination, getMyPurchases);

router.get("/check/:sheetId", authenticate, checkPurchaseStatus);

router.get('/download/:sheetId', authenticate, downloadPurchasedSheet);

router.get("/my/sales", authenticate, authorize('SELLER', 'ADMIN'), validatePagination, getMySales);

export default router;