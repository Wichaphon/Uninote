import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { rateSheet } from "../controllers/review.controller.js";

const router = express.Router();

//rate sheet
router.post('/:sheetId', authenticate, rateSheet);



export default router;