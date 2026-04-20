import { asyncHandler } from '../utils/asyncHandler.js';
import { createDriverApplication, createTransporterApplication } from '../services/application.service.js';

export const applyDriver = asyncHandler(async (req, res) => {
  const result = await createDriverApplication(req.body, req.files || {});
  res.status(201).json({ success: true, message: 'Driver application submitted. Fretron admin will review your details.', user: result });
});

export const applyTransporter = asyncHandler(async (req, res) => {
  const result = await createTransporterApplication(req.body, req.files || {});
  res.status(201).json({ success: true, message: 'Transporter application submitted. Fretron admin will review your business details.', user: result });
});
