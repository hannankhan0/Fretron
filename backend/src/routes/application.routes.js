import { Router } from 'express';
import { applyDriver, applyTransporter, driverStatus } from '../controllers/application.controller.js';
import { driverUpload, transporterUpload } from '../middleware/upload.middleware.js';
import { validateDriverApplication, validateTransporterApplication } from '../middleware/validateApplicationInput.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireClerkUser } from "../middleware/clerkAuth.middleware.js";
import { getMyDriverStatus } from "../controllers/application.controller.js";

const router = Router();
router.get("/driver/status", requireClerkUser, getMyDriverStatus);

router.post('/drivers/apply', requireAuth, driverUpload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'cnicFront', maxCount: 1 },
  { name: 'cnicBack', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 },
  { name: 'vehicleDocument', maxCount: 1 }
]), validateDriverApplication, applyDriver);

router.post('/transporters/apply', transporterUpload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'ownerCnicFront', maxCount: 1 },
  { name: 'ownerCnicBack', maxCount: 1 },
  { name: 'registrationDocument', maxCount: 1 }
]), validateTransporterApplication, applyTransporter);

export default router;
