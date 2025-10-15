import express from 'express';
import { validatePagination, validateSheetCreation } from '../middlewares/validation.middleware.js';
import { createSheet, getAllSheets, getMySheets, getSheetById } from '../controllers/sheet.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import uploadPdf from '../middlewares/uploadPdf.middleware.js';

const router = express.Router();

router.get("/", validatePagination, getAllSheets);
router.get("/:id", getSheetById);

//PROTECTED ROUTES

//สร้าง sheet
router.post("/", authenticate, authorize('SELLER', 'ADMIN'), uploadPdf.single('pdf'), validateSheetCreation, createSheet);

//ดูsheetตัวเอง (ของ seller เอง)
router.get("/my/sheets", authenticate, authorize('SELLER', 'ADMIN'), validatePagination, getMySheets);

export default router;