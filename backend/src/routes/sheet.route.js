import express from 'express';
import { validatePagination, validateSheetCreation } from '../middlewares/validation.middleware.js';
import { createSheet, getAllSheets, getSheetById } from '../controllers/sheet.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import uploadPdf from '../middlewares/uploadPdf.middleware.js';

const router = express.Router();

router.get("/", validatePagination, getAllSheets);
router.get("/:id", getSheetById);

//PROTECTED ROUTES
router.post("/", authenticate, authorize('SELLER', 'ADMIN'), uploadPdf.single('pdf'), validateSheetCreation, createSheet);

export default router;