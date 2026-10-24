import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import { ENV } from './config/env';
import { generalLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { sendSuccess, sendError } from './utils/response';

// Routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import postsRoutes from './modules/posts/posts.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import tagsRoutes from './modules/tags/tags.routes';
import commentsRoutes from './modules/comments/comments.routes';
import mediaRoutes from './modules/media/media.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import settingsRoutes from './modules/settings/settings.routes';
import auditRoutes from './modules/audit/audit.routes';
import metricsRoutes from './modules/metrics/metrics.routes';
import { metricsMiddleware } from './modules/metrics/metrics.middleware';

const app = express();

// Middleware giám sát chỉ số hệ thống Prometheus/Grafana
app.use(metricsMiddleware);

// Middlewares bảo mật & phân tích
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Phục vụ tệp tĩnh uploads
app.use('/uploads', express.static(ENV.UPLOAD_DIR));

// Áp dụng Rate Limiter cho các API
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, { status: 'UP', timestamp: new Date().toISOString() }, 'Hệ thống Blog/CMS hoạt động bình thường.');
});

// Endpoint giám sát Prometheus Metrics cho Grafana
app.use('/metrics', metricsRoutes);
app.use('/api/v1/metrics', metricsRoutes);

// Định tuyến API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/tags', tagsRoutes);
app.use('/api/v1/comments', commentsRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/audit-logs', auditRoutes);

// Bắt 404 cho các route không tồn tại
app.use('*', (req, res) => {
  return sendError(res, `Đường dẫn API '${req.originalUrl}' không tồn tại.`, 404);
});

// Xử lý lỗi tập trung
app.use(errorHandler);

export default app;
