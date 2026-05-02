import { pool } from '../config/db.js';
import { createNotification } from './notification.service.js';
import { ApiError } from '../utils/ApiError.js';
import { generateCode } from '../utils/code.js';

async function getShipmentBasic(shipmentPostId) {
  const [rows] = await pool.execute(
    `SELECT sp.*, u.full_name AS shipper_name
     FROM shipment_posts sp
     JOIN users u ON u.id = sp.user_id
     WHERE sp.id = ?
     LIMIT 1`,
    [shipmentPostId]
  );
  return rows[0] || null;
}

async function getRouteBasic(routePostId) {
  const [rows] = await pool.execute(
    `SELECT rp.*, u.full_name AS driver_name
     FROM route_posts rp
     JOIN users u ON u.id = rp.driver_user_id
     WHERE rp.id = ?
     LIMIT 1`,
    [routePostId]
  );
  return rows[0] || null;
}

async function getBookingById(bookingId) {
  const [rows] = await pool.execute(
    `SELECT b.*, sp.shipment_code, sp.pickup_city, sp.destination_city,
            rp.route_code, rp.origin_city, rp.destination_city AS route_destination_city
     FROM bookings b
     JOIN shipment_posts sp ON sp.id = b.shipment_post_id
     JOIN route_posts rp ON rp.id = b.route_post_id
     WHERE b.id = ?
     LIMIT 1`,
    [bookingId]
  );
  return rows[0] || null;
}

async function insertStatusLog(connection, bookingId, oldStatus, newStatus, changedByUserId, note = null) {
  await connection.execute(
    `INSERT INTO booking_status_logs (booking_id, old_status, new_status, changed_by_user_id, note)
     VALUES (?, ?, ?, ?, ?)`,
    [bookingId, oldStatus, newStatus, changedByUserId, note]
  );
}

export async function createBooking(currentUser, payload) {
  const shipment = await getShipmentBasic(payload.shipmentPostId);
  const route = await getRouteBasic(payload.routePostId);

  if (!shipment) throw new ApiError(404, 'Shipment post not found');
  if (!route) throw new ApiError(404, 'Route post not found');

  if (!['published', 'matched'].includes(shipment.status)) {
    throw new ApiError(400, 'This shipment is not open for booking');
  }

  if (!['published', 'partially_booked'].includes(route.status)) {
    throw new ApiError(400, 'This route is not open for booking');
  }

  let requesterRole;
  if (currentUser.role === 'user') {
    if (shipment.user_id !== currentUser.id) {
      throw new ApiError(403, 'You can only request using your own shipment');
    }
    requesterRole = 'user';
  } else if (currentUser.role === 'driver') {
    if (route.driver_user_id !== currentUser.id) {
      throw new ApiError(403, 'You can only send offers from your own route');
    }
    requesterRole = 'driver';
  } else {
    throw new ApiError(403, 'Only users and drivers can create bookings');
  }

  const [existingRows] = await pool.execute(
    `SELECT id
     FROM bookings
     WHERE shipment_post_id = ?
       AND route_post_id = ?
       AND booking_status IN ('pending','accepted','picked_up','in_transit')
     LIMIT 1`,
    [payload.shipmentPostId, payload.routePostId]
  );

  if (existingRows[0]) {
    throw new ApiError(409, 'A live booking already exists for this shipment and route');
  }

  const bookingCode = generateCode('BKG');
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO bookings
        (booking_code, shipment_post_id, route_post_id, user_id, driver_user_id, requester_role, agreed_price, booking_status, notes, booked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
      [
        bookingCode,
        shipment.id,
        route.id,
        shipment.user_id,
        route.driver_user_id,
        requesterRole,
        payload.agreedPrice || null,
        payload.notes || null
      ]
    );

    await connection.execute(
      `UPDATE shipment_posts
       SET status = 'matched'
       WHERE id = ? AND status = 'published'`,
      [shipment.id]
    );

    await insertStatusLog(connection, result.insertId, null, 'pending', currentUser.id, 'Booking request created');

    await connection.commit();

    const notifyUserId = requesterRole === 'user' ? route.driver_user_id : shipment.user_id;
    const title = requesterRole === 'user' ? 'New shipment request received' : 'New driver offer received';
    const body = requesterRole === 'user'
      ? `${currentUser.full_name} requested your route for shipment ${shipment.shipment_code}`
      : `${currentUser.full_name} offered a route for your shipment ${shipment.shipment_code}`;

    await createNotification({
      userId: notifyUserId,
      title,
      body,
      type: 'booking_request',
      relatedBookingId: result.insertId
    });

    return getBookingById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listUserBookings(userId, scope = 'all') {
  let sql = `
    SELECT b.*, sp.shipment_code, sp.pickup_city, sp.destination_city,
           rp.route_code, rp.origin_city, rp.destination_city AS route_destination_city,
           d.full_name AS driver_name
    FROM bookings b
    JOIN shipment_posts sp ON sp.id = b.shipment_post_id
    JOIN route_posts rp ON rp.id = b.route_post_id
    JOIN users d ON d.id = b.driver_user_id
    WHERE b.user_id = ?
  `;
  const params = [userId];

  if (scope === 'active') {
    sql += ` AND b.booking_status IN ('pending','accepted','picked_up','in_transit')`;
  } else if (scope === 'history') {
    sql += ` AND b.booking_status IN ('delivered','cancelled','rejected')`;
  }

  sql += ` ORDER BY b.created_at DESC`;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function listDriverBookings(driverUserId, scope = 'all') {
  let sql = `
    SELECT b.*, sp.shipment_code, sp.pickup_city, sp.destination_city,
           rp.route_code, rp.origin_city, rp.destination_city AS route_destination_city,
           u.full_name AS user_name, u.business_name
    FROM bookings b
    JOIN shipment_posts sp ON sp.id = b.shipment_post_id
    JOIN route_posts rp ON rp.id = b.route_post_id
    JOIN users u ON u.id = b.user_id
    WHERE b.driver_user_id = ?
  `;
  const params = [driverUserId];

  if (scope === 'active') {
    sql += ` AND b.booking_status IN ('pending','accepted','picked_up','in_transit')`;
  } else if (scope === 'history') {
    sql += ` AND b.booking_status IN ('delivered','cancelled','rejected')`;
  }

  sql += ` ORDER BY b.created_at DESC`;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function respondToBooking(currentUser, bookingId, action) {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.booking_status !== 'pending') throw new ApiError(400, 'Only pending bookings can be responded to');

  const responderShouldBe = booking.requester_role === 'user' ? 'driver' : 'user';
  const responderId = responderShouldBe === 'driver' ? booking.driver_user_id : booking.user_id;

  if (currentUser.role !== responderShouldBe || currentUser.id !== responderId) {
    throw new ApiError(403, 'You are not allowed to respond to this booking');
  }

  const newStatus = action === 'accept' ? 'accepted' : 'rejected';
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE bookings
       SET booking_status = ?
       WHERE id = ?`,
      [newStatus, bookingId]
    );

    await insertStatusLog(connection, bookingId, 'pending', newStatus, currentUser.id, `Booking ${newStatus}`);

    if (newStatus === 'accepted') {
      await connection.execute(
        `UPDATE shipment_posts SET status = 'booked' WHERE id = ?`,
        [booking.shipment_post_id]
      );
      await connection.execute(
        `UPDATE route_posts
         SET status = 'partially_booked'
         WHERE id = ? AND status = 'published'`,
        [booking.route_post_id]
      );
    }

    await connection.commit();

    const receiverId = booking.requester_role === 'user' ? booking.user_id : booking.driver_user_id;
    await createNotification({
      userId: receiverId,
      title: `Booking ${newStatus}`,
      body: `Your booking ${booking.booking_code} was ${newStatus}.`,
      type: 'booking_response',
      relatedBookingId: bookingId
    });

    return getBookingById(bookingId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateBookingStatusByDriver(currentUser, bookingId, newStatus) {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (currentUser.role !== 'driver' || booking.driver_user_id !== currentUser.id) {
    throw new ApiError(403, 'Only the assigned driver can update booking movement');
  }

  const allowedTransitions = {
    accepted: ['picked_up'],
    picked_up: ['in_transit'],
    in_transit: ['delivered']
  };

  const currentStatus = booking.booking_status;
  if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
    throw new ApiError(400, `Cannot move booking from ${currentStatus} to ${newStatus}`);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE bookings
       SET booking_status = ?,
           picked_up_at = CASE WHEN ? = 'picked_up' THEN NOW() ELSE picked_up_at END,
           delivered_at = CASE WHEN ? = 'delivered' THEN NOW() ELSE delivered_at END
       WHERE id = ?`,
      [newStatus, newStatus, newStatus, bookingId]
    );

    await insertStatusLog(connection, bookingId, currentStatus, newStatus, currentUser.id, 'Driver updated shipment movement');

    if (newStatus === 'picked_up' || newStatus === 'in_transit') {
      await connection.execute(
        `UPDATE shipment_posts SET status = 'in_transit' WHERE id = ?`,
        [booking.shipment_post_id]
      );
    }

    if (newStatus === 'delivered') {
      await connection.execute(
        `UPDATE shipment_posts SET status = 'delivered' WHERE id = ?`,
        [booking.shipment_post_id]
      );
      await connection.execute(
        `UPDATE route_posts SET status = 'completed' WHERE id = ?`,
        [booking.route_post_id]
      );
    }

    await connection.commit();

    await createNotification({
      userId: booking.user_id,
      title: 'Booking status updated',
      body: `Booking ${booking.booking_code} is now ${newStatus.replace('_', ' ')}.`,
      type: 'status_update',
      relatedBookingId: bookingId
    });

    return getBookingById(bookingId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function cancelBooking(currentUser, bookingId) {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner = booking.user_id === currentUser.id || booking.driver_user_id === currentUser.id;
  if (!isOwner) throw new ApiError(403, 'You cannot cancel this booking');

  if (!['pending', 'accepted'].includes(booking.booking_status)) {
    throw new ApiError(400, 'Only pending or accepted bookings can be cancelled');
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE bookings
       SET booking_status = 'cancelled', cancelled_at = NOW()
       WHERE id = ?`,
      [bookingId]
    );

    await insertStatusLog(connection, bookingId, booking.booking_status, 'cancelled', currentUser.id, 'Booking cancelled');

    await connection.execute(
      `UPDATE shipment_posts
       SET status = 'published'
       WHERE id = ? AND status IN ('matched','booked')`,
      [booking.shipment_post_id]
    );

    await connection.execute(
      `UPDATE route_posts
       SET status = 'published'
       WHERE id = ? AND status = 'partially_booked'`,
      [booking.route_post_id]
    );

    await connection.commit();

    const otherPartyId = booking.user_id === currentUser.id ? booking.driver_user_id : booking.user_id;
    await createNotification({
      userId: otherPartyId,
      title: 'Booking cancelled',
      body: `Booking ${booking.booking_code} has been cancelled.`,
      type: 'status_update',
      relatedBookingId: bookingId
    });

    return getBookingById(bookingId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}