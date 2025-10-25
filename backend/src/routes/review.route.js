import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyReview, rateSheet } from "../controllers/review.controller.js";

const router = express.Router();

//rate sheet
router.post('/:sheetId', authenticate, rateSheet);

//ดูคะแนนรีวิวของตัวเอง
router.get('/my/:sheetId', authenticate, getMyReview);

export default router;