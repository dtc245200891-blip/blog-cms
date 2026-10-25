import app from './app';
import { ENV } from './config/env';
import { ensureDatabaseReady, cleanupDatabase } from './config/db-bootstrap';

const PORT = ENV.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Tự động kiểm tra và sẵn sàng cơ sở dữ liệu MongoDB
    await ensureDatabaseReady();

    // 2. Khởi động máy chủ Express
    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Blog/CMS Backend Server running on port ${PORT}`);
      console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/v1`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📂 Uploads Dir:  ${ENV.UPLOAD_DIR}`);
      console.log(`====================================================`);
    });

    server.on('error', async (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Cổng ${PORT} hiện đang bị chiếm dụng bởi một tiến trình khác.`);
        console.error(`👉 Bạn có thể giải phóng cổng ${PORT} nhanh bằng lệnh PowerShell:`);
        console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
      } else {
        console.error('❌ Lỗi máy chủ:', err);
      }
      await cleanupDatabase();
      process.exit(1);
    });

    const shutdown = async () => {
      console.log('\n🛑 Đang dừng máy chủ Backend...');
      server.close(async () => {
        await cleanupDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Xử lý unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
      console.error('CRITICAL UNHANDLED REJECTION:', err);
    });
  } catch (error) {
    console.error('❌ Khởi động máy chủ thất bại:', error);
    process.exit(1);
  }
}

bootstrap();
