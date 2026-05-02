import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { generateCode } from '../utils/code.js';

export async function createRoutePost(driverUserId, payload) {
  const routeCode = generateCode('RTE');

  const [result] = await pool.execute(
    `INSERT INTO route_posts
      (driver_user_id, route_code, origin_city, destination_city,
       origin_lat, origin_lng, destination_lat, destination_lng,
       departure_datetime, estimated_arrival,
       available_capacity_kg, vehicle_type, pricing_model, price_amount,
       restrictions, operational_notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      driverUserId,
      routeCode,
      payload.originCity,
      payload.destinationCity,
      payload.originLat        || null,
      payload.originLng        || null,
      payload.destinationLat   || null,
      payload.destinationLng   || null,
      payload.departureDatetime,
      payload.estimatedArrival || null,
      payload.availableCapacityKg,
      payload.vehicleType,
      payload.pricingModel,
      payload.priceAmount      || null,
      payload.restrictions     || null,
      payload.operationalNotes || null,
      payload.status           || 'published',
    ]
  );

  return getRouteByIdForOwner(driverUserId, result.insertId);
}

export async function getRouteByIdForOwner(driverUserId, routeId) {
  const [rows] = await pool.execute(
    `SELECT rp.*
     FROM route_posts rp
     WHERE rp.id = ? AND rp.driver_user_id = ?
     LIMIT 1`,
    [routeId, driverUserId]
  );
  return rows[0] || null;
}

export async function listMyRoutePosts(driverUserId, status = '') {
  let sql = `SELECT rp.*,
                (SELECT COUNT(*) FROM bookings b WHERE b.route_post_id = rp.id AND b.booking_status IN ('pending','accepted','picked_up','in_transit')) AS active_booking_count
             FROM route_posts rp
             WHERE rp.driver_user_id = ?`;
  const params = [driverUserId];

  if (status) {
    sql += ` AND rp.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY rp.created_at DESC`;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function listPublishedRoutePosts(filters = {}) {
  let sql = `
    SELECT rp.id, rp.route_code, rp.origin_city, rp.destination_city, rp.departure_datetime,
           rp.estimated_arrival, rp.available_capacity_kg, rp.vehicle_type, rp.pricing_model,
           rp.price_amount, rp.restrictions, rp.operational_notes, rp.status, rp.created_at,
           u.full_name AS driver_name,
           dp.vehicle_model, dp.vehicle_number
    FROM route_posts rp
    JOIN users u ON u.id = rp.driver_user_id
    LEFT JOIN driver_profiles dp ON dp.user_id = rp.driver_user_id
    WHERE rp.status IN ('published','partially_booked')
  `;
  const params = [];

  if (filters.originCity) {
    sql += ` AND rp.origin_city LIKE ?`;
    params.push(`%${filters.originCity}%`);
  }
  if (filters.destinationCity) {
    sql += ` AND rp.destination_city LIKE ?`;
    params.push(`%${filters.destinationCity}%`);
  }
  if (filters.vehicleType) {
    sql += ` AND rp.vehicle_type LIKE ?`;
    params.push(`%${filters.vehicleType}%`);
  }

  sql += ` ORDER BY rp.created_at DESC`;

  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function deleteRoutePost(driverUserId, routeId) {
  const [activeBookings] = await pool.execute(
    `SELECT id
     FROM bookings
     WHERE route_post_id = ?
       AND booking_status IN ('pending','accepted','picked_up','in_transit')
     LIMIT 1`,
    [routeId]
  );

  if (activeBookings[0]) {
    throw new ApiError(400, 'You cannot delete a route that has an active booking');
  }

  const [result] = await pool.execute(
    `DELETE FROM route_posts WHERE id = ? AND driver_user_id = ?`,
    [routeId, driverUserId]
  );

  if (!result.affectedRows) {
    throw new ApiError(404, 'Route post not found');
  }
}

export async function updateRoutePost(driverUserId, routeId, payload) {
  const existing = await getRouteByIdForOwner(driverUserId, routeId);
  if (!existing) throw new ApiError(404, 'Route post not found');

  await pool.execute(
    `UPDATE route_posts
     SET origin_city = ?, destination_city = ?, departure_datetime = ?, estimated_arrival = ?,
         available_capacity_kg = ?, vehicle_type = ?, pricing_model = ?, price_amount = ?,
         restrictions = ?, operational_notes = ?, status = ?
     WHERE id = ? AND driver_user_id = ?`,
    [
      payload.originCity ?? existing.origin_city,
      payload.destinationCity ?? existing.destination_city,
      payload.departureDatetime ?? existing.departure_datetime,
      payload.estimatedArrival ?? existing.estimated_arrival,
      payload.availableCapacityKg ?? existing.available_capacity_kg,
      payload.vehicleType ?? existing.vehicle_type,
      payload.pricingModel ?? existing.pricing_model,
      payload.priceAmount ?? existing.price_amount,
      payload.restrictions ?? existing.restrictions,
      payload.operationalNotes ?? existing.operational_notes,
      payload.status ?? existing.status,
      routeId,
      driverUserId
    ]
  );

  return getRouteByIdForOwner(driverUserId, routeId);
}