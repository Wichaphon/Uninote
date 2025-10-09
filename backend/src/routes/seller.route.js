import express from 'express';
import { applyAsSeller, getSellerProfile } from '../controllers/seller.controller.js';
import { validateSellerApplication } from '../middlewares/validation.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

//สมัคร seller
router.post("/apply", authenticate, validateSellerApplication, applyAsSeller);

router.get("/profile", authenticate, getSellerProfile);



export default router;