import { Router } from 'express';
import { driverLogin, login, logout, me, signup, transporterLogin } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateLogin, validateSignup } from '../middleware/validateAuthInput.js';
import { syncClerkUser } from "../controllers/auth.controller.js";

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/driver/login', validateLogin, driverLogin);
router.post('/transporter/login', validateLogin, transporterLogin);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);



router.post("/clerk/sync-user", syncClerkUser);


export default router;
