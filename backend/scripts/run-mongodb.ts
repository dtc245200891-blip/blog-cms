import { MongoMemoryReplSet } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';

async function startLocalMongo() {
  console.log('🚀 Đang khởi động máy chủ NoSQL MongoDB 7.0 (Replica Set rs0)...');

  const dataDir = path.resolve(__dirname, '../.mongo-data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const replSet = await MongoMemoryReplSet.create({
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

  const uri = replSet.getUri('blog_cms');
  console.log('====================================================');
  console.log('🍃 MongoDB Replica Set đã sẵn sàng phục vụ Blog/CMS!');
  console.log(`🌐 Chuỗi kết nối DATABASE_URL:`);
  console.log(`   mongodb://127.0.0.1:27017/blog_cms?replicaSet=rs0&directConnection=true`);
  console.log(`📁 Thư mục lưu dữ liệu: ${dataDir}`);
  console.log('👉 Sẵn sàng cho Prisma ORM, kiểm thử và ứng dụng.');
  console.log('   (Nhấn Ctrl + C để dừng dịch vụ khi hoàn tất)');
  console.log('====================================================');

  process.on('SIGINT', async () => {
    console.log('\n🛑 Đang tắt máy chủ MongoDB...');
    await replSet.stop();
    process.exit(0);
  });
}

startLocalMongo().catch((err) => {
  console.error('❌ Lỗi khi khởi động MongoDB cục bộ:', err);
  process.exit(1);
});
