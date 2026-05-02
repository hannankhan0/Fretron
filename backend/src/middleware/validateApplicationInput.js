import { ApiError } from '../utils/ApiError.js';

export function validateDriverApplication(req, _res, next) {
  const required = ['fullName', 'email', 'phone', 'cnic', 'city', 'address', 'licenseNumber', 'licenseExpiry', 'vehicleType', 'vehicleModel', 'vehicleNumber', 'vehicleCapacityKg'];
  for (const key of required) {
    if (!req.body?.[key]) return next(new ApiError(400, `Missing required field: ${key}`));
  }
  next();
}

export function validateTransporterApplication(req, _res, next) {
  const required = ['ownerName', 'businessName', 'email', 'phone', 'password', 'registrationNumber', 'businessType', 'city', 'address', 'fleetSize', 'serviceAreas'];
  for (const key of required) {
    if (!req.body?.[key]) return next(new ApiError(400, `Missing required field: ${key}`));
  }
  if (req.body.password.length < 6) return next(new ApiError(400, 'Password must be at least 6 characters'));
  next();
}
