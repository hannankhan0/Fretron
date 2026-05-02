import { asyncHandler } from '../utils/asyncHandler.js';
import {
  cancelBooking,
  createBooking,
  listDriverBookings,
  listUserBookings,
  respondToBooking,
  updateBookingStatusByDriver
} from '../services/booking.service.js';

export const createBookingRequest = asyncHandler(async (req, res) => {
  const booking = await createBooking(req.user, req.body);
  res.status(201).json({ success: true, booking, message: 'Booking request created successfully' });
});

export const getMyUserBookings = asyncHandler(async (req, res) => {
  const bookings = await listUserBookings(req.user.id, req.query.scope || 'all');
  res.status(200).json({ success: true, bookings });
});

export const getMyDriverBookings = asyncHandler(async (req, res) => {
  const bookings = await listDriverBookings(req.user.id, req.query.scope || 'all');
  res.status(200).json({ success: true, bookings });
});

export const respondBooking = asyncHandler(async (req, res) => {
  const booking = await respondToBooking(req.user, req.params.id, req.body.action);
  res.status(200).json({ success: true, booking, message: 'Booking response saved successfully' });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await updateBookingStatusByDriver(req.user, req.params.id, req.body.status);
  res.status(200).json({ success: true, booking, message: 'Booking status updated successfully' });
});

export const cancelBookingRequest = asyncHandler(async (req, res) => {
  const booking = await cancelBooking(req.user, req.params.id);
  res.status(200).json({ success: true, booking, message: 'Booking cancelled successfully' });
});