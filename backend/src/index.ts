import app from './app';
import { ENV } from './config/env';

const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Blog/CMS Backend Server running on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📂 Uploads Dir:  ${ENV.UPLOAD_DIR}`);
  console.log(`====================================================`);
});

// Xử lý unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('CRITICAL UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});
