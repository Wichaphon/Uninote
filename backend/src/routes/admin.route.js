import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { approveSeller, getPendingSellers } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

//Seller Management
router.get("/sellers/pending", getPendingSellers);
router.post('/sellers/:sellerId/approve', approveSeller);

export default router;