import { pool } from '../config/db.js';

export async function getUserDashboard(userId) {
  const [[shipmentCount]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM shipment_posts WHERE user_id = ?`,
    [userId]
  );

  const [[activeBookings]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM bookings
     WHERE user_id = ?
       AND booking_status IN ('pending','accepted','picked_up','in_transit')`,
    [userId]
  );

  const [[completedBookings]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM bookings
     WHERE user_id = ?
       AND booking_status = 'delivered'`,
    [userId]
  );

  const [[unreadNotifications]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM notifications
     WHERE user_id = ? AND is_read = 0`,
    [userId]
  );

  const [recentShipments] = await pool.execute(
    `SELECT id, shipment_code, pickup_city, destination_city, status, created_at
     FROM shipment_posts
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  );

  const [recentBookings] = await pool.execute(
    `SELECT booking_code, booking_status, created_at
     FROM bookings
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  );

  return {
    stats: {
      shipmentPosts: shipmentCount.total,
      activeBookings: activeBookings.total,
      completedBookings: completedBookings.total,
      unreadNotifications: unreadNotifications.total
    },
    recentShipments,
    recentBookings
  };
}

export async function getDriverDashboard(driverUserId) {
  const [[routeCount]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM route_posts WHERE driver_user_id = ?`,
    [driverUserId]
  );

  const [[activeCargo]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM bookings
     WHERE driver_user_id = ?
       AND booking_status IN ('pending','accepted','picked_up','in_transit')`,
    [driverUserId]
  );

  const [[completedTrips]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM bookings
     WHERE driver_user_id = ?
       AND booking_status = 'delivered'`,
    [driverUserId]
  );

  const [[unreadNotifications]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM notifications
     WHERE user_id = ? AND is_read = 0`,
    [driverUserId]
  );

  const [recentRoutes] = await pool.execute(
    `SELECT id, route_code, origin_city, destination_city, status, created_at
     FROM route_posts
     WHERE driver_user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [driverUserId]
  );

  const [recentBookings] = await pool.execute(
    `SELECT booking_code, booking_status, created_at
     FROM bookings
     WHERE driver_user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [driverUserId]
  );

  return {
    stats: {
      routePosts: routeCount.total,
      activeCargo: activeCargo.total,
      completedTrips: completedTrips.total,
      unreadNotifications: unreadNotifications.total
    },
    recentRoutes,
    recentBookings
  };
}