import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireApprovedRole } from '../middleware/role.middleware.js';
import { createShipment, editShipment, getMyShipments, getPublishedShipments, removeShipment } from '../controllers/shipment.controller.js';

const router = Router();

router.get('/', requireAuth, getPublishedShipments);
router.get('/my', requireAuth, requireApprovedRole('user'), getMyShipments);
router.post('/', requireAuth, requireApprovedRole('user'), createShipment);
router.patch('/:id', requireAuth, requireApprovedRole('user'), editShipment);
router.delete('/:id', requireAuth, requireApprovedRole('user'), removeShipment);

export default router;