import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { approveSeller, getPendingSellers, rejectSeller } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

//Seller Management
router.get("/sellers/pending", getPendingSellers);
router.post('/sellers/:sellerId/approve', approveSeller);
router.post('/sellers/:sellerId/reject', rejectSeller);

export default router;