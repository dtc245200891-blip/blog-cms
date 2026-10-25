import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../../prisma/seed';

let replSet: MongoMemoryReplSet | null = null;

export async function setup() {
  console.log('🍃 Đang khởi tạo MongoDB Replica Set toàn cục cho Vitest...');

  replSet = await MongoMemoryReplSet.create({
    instanceOpts: [
      {
        port: 27017,
        storageEngine: 'wiredTiger',
      },
    ],
    replSet: {
      name: 'rs0',
      count: 1,
    },
  });

  const uri = 'mongodb://127.0.0.1:27017/blog_cms?replicaSet=rs0&directConnection=true';
  process.env.DATABASE_URL = uri;
  console.log(`🍃 Test MongoDB Replica Set đã sẵn sàng tại cổng 27017`);

  const prisma = new PrismaClient({
    datasources: { db: { url: uri } },
  });
  await prisma.$connect();
  await seedDatabase(prisma);
  await prisma.$disconnect();
}

export async function teardown() {
  if (replSet) {
    await replSet.stop();
    console.log('🍃 Đã tắt Test MongoDB Replica Set.');
  }
}
