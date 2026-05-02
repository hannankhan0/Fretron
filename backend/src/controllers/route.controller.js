import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createRoutePost,
  deleteRoutePost,
  listMyRoutePosts,
  listPublishedRoutePosts,
  updateRoutePost
} from '../services/route.service.js';

export const createRoute = asyncHandler(async (req, res) => {
  const route = await createRoutePost(req.user.id, req.body);
  res.status(201).json({ success: true, route });
});

export const getMyRoutes = asyncHandler(async (req, res) => {
  const routes = await listMyRoutePosts(req.user.id, req.query.status || '');
  res.status(200).json({ success: true, routes });
});

export const getPublishedRoutes = asyncHandler(async (req, res) => {
  const routes = await listPublishedRoutePosts(req.query);
  res.status(200).json({ success: true, routes });
});

export const removeRoute = asyncHandler(async (req, res) => {
  await deleteRoutePost(req.user.id, req.params.id);
  res.status(200).json({ success: true, message: 'Route deleted successfully' });
});

export const editRoute = asyncHandler(async (req, res) => {
  const route = await updateRoutePost(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, route, message: 'Route updated successfully' });
});