import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createShipmentPost,
  deleteShipmentPost,
  listMyShipmentPosts,
  listPublishedShipmentPosts,
  updateShipmentPost
} from '../services/shipment.service.js';

export const createShipment = asyncHandler(async (req, res) => {
  const shipment = await createShipmentPost(req.user.id, req.body);
  res.status(201).json({ success: true, shipment });
});

export const getMyShipments = asyncHandler(async (req, res) => {
  const shipments = await listMyShipmentPosts(req.user.id, req.query.status || '');
  res.status(200).json({ success: true, shipments });
});

export const getPublishedShipments = asyncHandler(async (req, res) => {
  const shipments = await listPublishedShipmentPosts(req.query);
  res.status(200).json({ success: true, shipments });
});

export const removeShipment = asyncHandler(async (req, res) => {
  await deleteShipmentPost(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: 'Shipment deleted successfully' });
});

export const editShipment = asyncHandler(async (req, res) => {
  const shipment = await updateShipmentPost(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, shipment, message: 'Shipment updated successfully' });
});