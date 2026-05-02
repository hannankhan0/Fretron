import { pool } from '../config/db.js';

export async function createNotification({ userId, title, body, type = 'general', relatedBookingId = null }) {
  await pool.execute(
    `INSERT INTO notifications (user_id, title, body, type, related_booking_id)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, title, body, type, relatedBookingId]
  );
}

export async function listMyNotifications(userId) {
  const [rows] = await pool.execute(
    `SELECT id, title, body, type, is_read, related_booking_id, created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function markNotificationRead(userId, notificationId) {
  const [result] = await pool.execute(
    `UPDATE notifications
     SET is_read = 1
     WHERE id = ? AND user_id = ?`,
    [notificationId, userId]
  );
  return result.affectedRows > 0;
}