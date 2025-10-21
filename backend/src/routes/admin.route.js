import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { getPendingSellers } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

//Seller Management
router.get("/sellers/pending", getPendingSellers);


export default router;