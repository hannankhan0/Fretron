import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireApprovedRole } from '../middleware/role.middleware.js';
import { createRoute, editRoute, getMyRoutes, getPublishedRoutes, removeRoute } from '../controllers/route.controller.js';

const router = Router();

router.get('/', requireAuth, getPublishedRoutes);
router.get('/my', requireAuth, requireApprovedRole('driver'), getMyRoutes);
router.post('/', requireAuth, requireApprovedRole('driver'), createRoute);
router.patch('/:id', requireAuth, requireApprovedRole('driver'), editRoute);
router.delete('/:id', requireAuth, requireApprovedRole('driver'), removeRoute);

export default router;