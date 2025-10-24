import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { approveSeller, getAllPurchases, getAllSheetsAdmin, getAllUsers, getDashboardStats, getPendingSellers, rejectSeller, toggleSheetStatus, toggleUserStatus } from '../controllers/admin.controller.js';
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

//Sheet Management
router.get("/sheets", validatePagination, getAllSheetsAdmin);
router.patch('/sheets/:sheetId/toggle-status', toggleSheetStatus);

//Dashboard
router.get('/stats/dashboard', getDashboardStats);

//Purchase Management



export default router;