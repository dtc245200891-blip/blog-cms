import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { PrismaClient } from '@prisma/client';
import net from 'net';
import { seedDatabase } from '../config/seed';

let replSet: MongoMemoryReplSet | null = null;

async function isPortOpen(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
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

export async function setup() {
  const uri = 'mongodb://127.0.0.1:27017/blog_cms?replicaSet=rs0&directConnection=true';
  process.env.DATABASE_URL = uri;

  const portOpen = await isPortOpen(27017);
  if (!portOpen) {
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
    console.log(`🍃 Test MongoDB Replica Set đã sẵn sàng tại cổng 27017`);
  } else {
    console.log('🍃 Tái sử dụng MongoDB Replica Set đang hoạt động tại cổng 27017...');
  }

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
