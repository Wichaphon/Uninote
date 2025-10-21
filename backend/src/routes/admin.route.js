import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

export default router;