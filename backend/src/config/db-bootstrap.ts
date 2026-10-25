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
      try {
        const { MongoMemoryReplSet } = await import('mongodb-memory-server');
        const dataDir = path.resolve(__dirname, '../../.mongo-data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        embeddedReplSet = await MongoMemoryReplSet.create({
          instanceOpts: [
            {
              port: 27017,
              dbPath: dataDir,
              storageEngine: 'wiredTiger',
            },
          ],
          replSet: {
            name: 'rs0',
            count: 1,
          },
        });

        console.log('====================================================');
        console.log('✅ MongoDB NoSQL 7.0 (rs0) đã khởi động tự động tại 127.0.0.1:27017!');
        console.log(`📁 Thư mục lưu dữ liệu kiên cố: ${dataDir}`);
        console.log('====================================================');
      } catch (err: any) {
        console.warn('⚠️ Không thể tự động khởi động MongoMemoryReplSet:', err.message);
        console.log('👉 Vui lòng đảm bảo MongoDB/Docker đang hoạt động trên cổng 27017.');
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
