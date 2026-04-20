import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireApprovedRole } from '../middleware/role.middleware.js';
import { driverDashboard, userDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/user', requireAuth, requireApprovedRole('user'), userDashboard);
router.get('/driver', requireAuth, requireApprovedRole('driver'), driverDashboard);

export default router;