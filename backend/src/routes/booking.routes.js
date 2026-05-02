import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireApprovedRole } from '../middleware/role.middleware.js';
import {
  cancelBookingRequest,
  createBookingRequest,
  getMyDriverBookings,
  getMyUserBookings,
  respondBooking,
  updateBookingStatus
} from '../controllers/booking.controller.js';

const router = Router();

router.post('/', requireAuth, requireApprovedRole('user', 'driver'), createBookingRequest);
router.get('/my-user', requireAuth, requireApprovedRole('user'), getMyUserBookings);
router.get('/my-driver', requireAuth, requireApprovedRole('driver'), getMyDriverBookings);
router.patch('/:id/respond', requireAuth, requireApprovedRole('user', 'driver'), respondBooking);
router.patch('/:id/status', requireAuth, requireApprovedRole('driver'), updateBookingStatus);
router.patch('/:id/cancel', requireAuth, requireApprovedRole('user', 'driver'), cancelBookingRequest);

export default router;