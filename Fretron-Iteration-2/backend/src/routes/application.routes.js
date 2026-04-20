import { Router } from 'express';
import { applyDriver, applyTransporter } from '../controllers/application.controller.js';
import { driverUpload, transporterUpload } from '../middleware/upload.middleware.js';
import { validateDriverApplication, validateTransporterApplication } from '../middleware/validateApplicationInput.js';

const router = Router();

router.post('/drivers/apply', driverUpload.fields([
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
