import { asyncHandler } from '../utils/asyncHandler.js';
import { getDriverDashboard, getUserDashboard } from '../services/dashboard.service.js';

export const userDashboard = asyncHandler(async (req, res) => {
  const data = await getUserDashboard(req.user.id);
  res.status(200).json({ success: true, ...data });
});

export const driverDashboard = asyncHandler(async (req, res) => {
  const data = await getDriverDashboard(req.user.id);
  res.status(200).json({ success: true, ...data });
});