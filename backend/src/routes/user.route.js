import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { changePassword, deleteAccount, deleteAvatar, getProfile, updateProfile, uploadAvatar } from '../controllers/user.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();
router.use(authenticate); //ให้ทัก route ต้อง authen

//Profile Manage
router.get("/me", getProfile);
router.put("/me", updateProfile);

//Avatar Manage
router.put("/me/avatar", upload.single("avatar"), uploadAvatar);
router.delete("/me/avatar", deleteAvatar);

router.put("/me/password", changePassword);
router.delete("/me", deleteAccount);

export default router;