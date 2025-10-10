import express from 'express';
import { applyAsSeller, getSellerProfile, updateSellerProfile } from '../controllers/seller.controller.js';
import { validateSellerApplication, validateSellerUpdate } from '../middlewares/validation.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

//สมัคร seller
router.post("/apply", authenticate, validateSellerApplication, applyAsSeller);

router.get("/profile", authenticate, getSellerProfile);

router.put("/profile", authenticate, authorize('SELLER', 'ADMIN'), validateSellerUpdate, updateSellerProfile);

export default router;