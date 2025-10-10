import express from 'express';
import { validatePagination } from '../middlewares/validation.middleware.js';
import { getAllSheets } from '../controllers/sheet.controller.js';

const router = express.Router();

router.get("/", validatePagination, getAllSheets);

export default router;