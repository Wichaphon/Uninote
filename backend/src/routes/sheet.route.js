import express from 'express';
import { validatePagination } from '../middlewares/validation.middleware.js';
import { getAllSheets, getSheetById } from '../controllers/sheet.controller.js';

const router = express.Router();

router.get("/", validatePagination, getAllSheets);
router.get("/:id", getSheetById);

export default router;