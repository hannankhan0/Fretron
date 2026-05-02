import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { generateCode } from '../utils/code.js';

export async function createShipmentPost(userId, payload) {
  const shipmentCode = generateCode('SHP');

  const [result] = await pool.execute(
    `INSERT INTO shipment_posts
      (user_id, shipment_code, pickup_city, destination_city, pickup_date, preferred_delivery_date,
       parcel_category, urgency, weight_kg, dimensions, capacity_needed, budget, handling_notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      shipmentCode,
      payload.pickupCity,
      payload.destinationCity,
      payload.pickupDate,
      payload.preferredDeliveryDate || null,
      payload.parcelCategory,
      payload.urgency,
      payload.weightKg,
      payload.dimensions || null,
      payload.capacityNeeded || null,
      payload.budget || null,
      payload.handlingNotes || null,
      payload.status || 'published'
    ]
  );

  return getShipmentByIdForOwner(userId, result.insertId);
}

export async function getShipmentByIdForOwner(userId, shipmentId) {
  const [rows] = await pool.execute(
    `SELECT sp.*
     FROM shipment_posts sp
     WHERE sp.id = ? AND sp.user_id = ?
     LIMIT 1`,
    [shipmentId, userId]
  );
  return rows[0] || null;
}

export async function listMyShipmentPosts(userId, status = '') {
  let sql = `SELECT sp.*,
                (SELECT COUNT(*) FROM bookings b WHERE b.shipment_post_id = sp.id AND b.booking_status IN ('pending','accepted','picked_up','in_transit')) AS active_booking_count
             FROM shipment_posts sp
             WHERE sp.user_id = ?`;
  const params = [userId];

  if (status) {
    sql += ` AND sp.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY sp.created_at DESC`;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function listPublishedShipmentPosts(filters = {}) {
  let sql = `
    SELECT sp.id, sp.shipment_code, sp.pickup_city, sp.destination_city, sp.pickup_date,
           sp.preferred_delivery_date, sp.parcel_category, sp.urgency, sp.weight_kg,
           sp.dimensions, sp.capacity_needed, sp.budget, sp.handling_notes, sp.status,
           sp.created_at, u.full_name AS shipper_name, u.business_name
    FROM shipment_posts sp
    JOIN users u ON u.id = sp.user_id
    WHERE sp.status IN ('published','matched')
  `;
  const params = [];

  if (filters.pickupCity) {
    sql += ` AND sp.pickup_city LIKE ?`;
    params.push(`%${filters.pickupCity}%`);
  }
  if (filters.destinationCity) {
    sql += ` AND sp.destination_city LIKE ?`;
    params.push(`%${filters.destinationCity}%`);
  }
  if (filters.parcelCategory) {
    sql += ` AND sp.parcel_category LIKE ?`;
    params.push(`%${filters.parcelCategory}%`);
  }
  if (filters.urgency) {
    sql += ` AND sp.urgency LIKE ?`;
    params.push(`%${filters.urgency}%`);
  }

  sql += ` ORDER BY sp.created_at DESC`;

  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function deleteShipmentPost(userId, shipmentId) {
  const [activeBookings] = await pool.execute(
    `SELECT id
     FROM bookings
     WHERE shipment_post_id = ?
       AND booking_status IN ('pending','accepted','picked_up','in_transit')
     LIMIT 1`,
    [shipmentId]
  );

  if (activeBookings[0]) {
    throw new ApiError(400, 'You cannot delete a shipment that has an active booking');
  }

  const [result] = await pool.execute(
    `DELETE FROM shipment_posts WHERE id = ? AND user_id = ?`,
    [shipmentId, userId]
  );

  if (!result.affectedRows) {
    throw new ApiError(404, 'Shipment post not found');
  }
}

export async function updateShipmentPost(userId, shipmentId, payload) {
  const existing = await getShipmentByIdForOwner(userId, shipmentId);
  if (!existing) throw new ApiError(404, 'Shipment post not found');

  await pool.execute(
    `UPDATE shipment_posts
     SET pickup_city = ?, destination_city = ?, pickup_date = ?, preferred_delivery_date = ?,
         parcel_category = ?, urgency = ?, weight_kg = ?, dimensions = ?, capacity_needed = ?,
         budget = ?, handling_notes = ?, status = ?
     WHERE id = ? AND user_id = ?`,
    [
      payload.pickupCity ?? existing.pickup_city,
      payload.destinationCity ?? existing.destination_city,
      payload.pickupDate ?? existing.pickup_date,
      payload.preferredDeliveryDate ?? existing.preferred_delivery_date,
      payload.parcelCategory ?? existing.parcel_category,
      payload.urgency ?? existing.urgency,
      payload.weightKg ?? existing.weight_kg,
      payload.dimensions ?? existing.dimensions,
      payload.capacityNeeded ?? existing.capacity_needed,
      payload.budget ?? existing.budget,
      payload.handlingNotes ?? existing.handling_notes,
      payload.status ?? existing.status,
      shipmentId,
      userId
    ]
  );

  return getShipmentByIdForOwner(userId, shipmentId);
}