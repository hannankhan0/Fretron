import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  adminMe,
  approveDriver,
  approveTransporter,
  dashboard,
  driverRequestDetail,
  listApprovedDrivers,
  listApprovedTransporters,
  listDriverRequests,
  listTransporterRequests,
  listUsers,
  rejectDriver,
  rejectTransporter,
  transporterRequestDetail,
} from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validateLogin } from '../middleware/validateAuthInput.js';

const router = Router();
router.post('/login', validateLogin, adminLogin);
router.use(requireAuth, requireAdmin);
router.get('/me', adminMe);
router.post('/logout', adminLogout);
router.get('/dashboard', dashboard);
router.get('/driver-requests', listDriverRequests);
router.get('/driver-requests/:id', driverRequestDetail);
router.patch('/driver-requests/:id/approve', approveDriver);
router.patch('/driver-requests/:id/reject', rejectDriver);
router.get('/transporter-requests', listTransporterRequests);
router.get('/transporter-requests/:id', transporterRequestDetail);
router.patch('/transporter-requests/:id/approve', approveTransporter);
router.patch('/transporter-requests/:id/reject', rejectTransporter);
router.get('/users', listUsers);
router.get('/drivers', listApprovedDrivers);
router.get('/transporters', listApprovedTransporters);
export default router;
