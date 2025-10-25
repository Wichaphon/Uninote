import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyReview, getSheetRating, rateSheet } from "../controllers/review.controller.js";

const router = express.Router();

//rate sheet
router.post('/:sheetId', authenticate, rateSheet);

//ดูคะแนนรีวิวของตัวเอง
router.get('/my/:sheetId', authenticate, getMyReview);

//ดูคะแนนเฉลี่ยของ sheet (public)
router.get('/:sheetId', getSheetRating);

export default router;