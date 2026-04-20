import { ApiError } from '../utils/ApiError.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s]{7,20}$/;

export function validateSignup(req, _res, next) {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return next(new ApiError(400, 'Full name must be at least 3 characters'));
  }

  if (!email || !emailRegex.test(email.trim())) {
    return next(new ApiError(400, 'Please provide a valid email address'));
  }

  if (!password || password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters'));
  }

  if (phone && !phoneRegex.test(phone.trim())) {
    return next(new ApiError(400, 'Please provide a valid phone number'));
  }

  next();
}

export function validateLogin(req, _res, next) {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email.trim())) {
    return next(new ApiError(400, 'Please provide a valid email address'));
  }

  if (!password || password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters'));
  }

  next();
}
