import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getProfile } from '../controllers/user.controller.js';

const router = express.Router();
router.use(authenticate); //ให้ทัก route ต้อง authen

router.get("/me", getProfile);

export default router;