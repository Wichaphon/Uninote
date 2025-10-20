import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPurchaseStatus, createPurchase, getMyPurchases } from "../controllers/purchase.controller.js";
import { validatePagination } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/:sheetId", authenticate, createPurchase);

router.get("/my/purchases", authenticate, validatePagination, getMyPurchases);

router.get("/check/:sheetId", authenticate, checkPurchaseStatus);

export default router;