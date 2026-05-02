import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getMyNotifications, readNotification } from '../controllers/notification.controller.js';

const router = Router();

router.get('/', requireAuth, getMyNotifications);
router.patch('/:id/read', requireAuth, readNotification);

export default router;