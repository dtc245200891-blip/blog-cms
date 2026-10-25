import net from 'net';
import path from 'path';
import fs from 'fs';
import { prisma } from './prisma';
import { seedDatabase } from './seed';

let embeddedReplSet: any = null;

export async function isPortOpen(port: number, host = '127.0.0.1', timeout = 1200): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

export async function ensureDatabaseReady(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL || '';
  const isLocalHost = dbUrl.includes('127.0.0.1') || dbUrl.includes('localhost') || !dbUrl;

  if (isLocalHost && process.env.NODE_ENV !== 'production') {
    const isMongoListening = await isPortOpen(27017, '127.0.0.1');

    if (!isMongoListening) {
      console.log('🍃 MongoDB chưa chạy trên cổng 27017. Đang tự động khởi động MongoDB NoSQL 7.0 (Replica Set rs0)...');
      
      const { MongoMemoryReplSet } = await import('mongodb-memory-server');
      const dataDir = path.resolve(__dirname, '../../.mongo-data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Xóa sạch lock files cũ nếu còn sót lại do tắt tiến trình đột ngột
      const lockFiles = ['mongod.lock', 'WiredTiger.lock'];
      for (const file of lockFiles) {
        const fullPath = path.join(dataDir, file);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch {}
        }
      }

      const startReplSet = async (usePersistentDir: boolean) => {
        const instanceOpts: any = {
          port: 27017,
          storageEngine: 'wiredTiger',
          launchTimeout: 60000, // 60 giây thay vì mặc định 10 giây
        };

        if (usePersistentDir) {
          instanceOpts.dbPath = dataDir;
        }

        return await MongoMemoryReplSet.create({
          instanceOpts: [instanceOpts],
          replSet: {
            name: 'rs0',
            count: 1,
          },
        });
      };

      try {
        // 1. Thử khởi động với thư mục lưu trữ kiên cố .mongo-data
        embeddedReplSet = await startReplSet(true);
        console.log('====================================================');
        console.log('✅ MongoDB NoSQL 7.0 (rs0) đã khởi động tự động tại 127.0.0.1:27017!');
        console.log(`📁 Thư mục lưu dữ liệu kiên cố: ${dataDir}`);
        console.log('====================================================');
      } catch (err: any) {
        console.warn('⚠️ Lỗi khi khởi động với dữ liệu cũ:', err.message);
        console.log('🔄 Đang tự động kích hoạt cơ chế tự phục hồi (Self-Healing)...');
        try {
          embeddedReplSet = await startReplSet(false);
          console.log('✅ MongoDB Replica Set đã tự phục hồi thành công tại 127.0.0.1:27017!');
        } catch (fatalErr: any) {
          console.error('❌ Không thể khởi động máy chủ MongoDB:', fatalErr.message);
          throw new Error('Vui lòng đảm bảo không có tiến trình mongod nào bị kẹt, hoặc chạy "npm run clean:port".');
        }
      }
    } else {
      console.log('🍃 Đã phát hiện dịch vụ MongoDB đang lắng nghe trên cổng 27017.');
    }
  }

  // Kết nối Prisma và kiểm tra tự động nạp dữ liệu (Auto-seed)
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 Cơ sở dữ liệu MongoDB đang trống. Đang tự động nạp dữ liệu mẫu ban đầu (Seeding)...');
      await seedDatabase(prisma);
      console.log('✅ Đã nạp thành công dữ liệu mẫu (Users, Posts, Categories, Tags, Settings)!');
    } else {
      console.log(`✅ Kết nối MongoDB thành công! Hiện có ${userCount} tài khoản trong hệ thống.`);
    }
  } catch (err: any) {
    console.error('❌ Lỗi kết nối MongoDB qua Prisma ORM:', err.message);
    throw err;
  }
}

export async function cleanupDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    if (embeddedReplSet) {
      console.log('🛑 Đang dừng máy chủ MongoDB tự động...');
      await embeddedReplSet.stop();
      embeddedReplSet = null;
    }
  } catch (err) {
    console.error('Lỗi khi dọn dẹp cơ sở dữ liệu:', err);
  }
}
