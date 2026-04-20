// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import express from 'express';
// import helmet from 'helmet';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { env } from './config/env.js';
// import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
// import authRoutes from './routes/auth.routes.js';
// import applicationRoutes from './routes/application.routes.js';
// import adminRoutes from './routes/admin.routes.js';

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(cors({ origin: env.frontendUrl, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.get('/api/health', (_req, res) => {
//   res.status(200).json({ success: true, message: 'Fretron backend is running' });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/admin', adminRoutes);

// app.use(notFoundHandler);
// app.use(errorHandler);

// export default app;


import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import adminRoutes from './routes/admin.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import routeRoutes from './routes/route.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Fretron backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;