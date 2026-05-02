import { asyncHandler } from '../utils/asyncHandler.js';
import { listMyNotifications, markNotificationRead } from '../services/notification.service.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await listMyNotifications(req.user.id);
  res.status(200).json({ success: true, notifications });
});

export const readNotification = asyncHandler(async (req, res) => {
  const ok = await markNotificationRead(req.user.id, req.params.id);
  res.status(200).json({ success: ok, message: ok ? 'Notification marked as read' : 'Notification not found' });
});