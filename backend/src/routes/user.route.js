import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { changePassword, getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();
router.use(authenticate); //ให้ทัก route ต้อง authen


//Profile Manage
router.get("/me", getProfile);
router.put("/me", updateProfile);

router.put("/me/password", changePassword);

export default router;