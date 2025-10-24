import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { approveSeller, getAllUsers, getPendingSellers, rejectSeller, toggleUserStatus } from '../controllers/admin.controller.js';
import { validatePagination } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

//Seller Management
router.get("/sellers/pending", getPendingSellers);
router.post('/sellers/:sellerId/approve', approveSeller);
router.post('/sellers/:sellerId/reject', rejectSeller);

//User Management
router.get("/users", validatePagination, getAllUsers);
router.patch("/users/:userId/toggle-status", toggleUserStatus);

export default router;