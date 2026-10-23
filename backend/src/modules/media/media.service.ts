import { prisma } from '../../config/prisma';
import fs from 'fs';
import path from 'path';
import { ENV } from '../../config/env';

export class MediaService {
  static async uploadFile(user: { id: string }, file: Express.Multer.File) {
    const url = `/uploads/${file.filename}`;

    const media = await prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        uploaderId: user.id,
      },
    });

    return media;
  }

  static async getMediaList(options: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 12));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.search) {
      where.originalName = { contains: options.search };
    }

    const [total, media] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploader: { select: { id: true, fullName: true, username: true } },
        },
      }),
    ]);

    return {
      media,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async deleteMedia(user: { id: string; role: string }, mediaId: string) {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error('Tệp không tồn tại.');

    if (user.role !== 'ADMIN' && media.uploaderId !== user.id) {
      throw new Error('Bạn không có quyền xóa tệp của người khác.');
    }

    // Xóa file vật lý trên đĩa
    const filePath = path.join(ENV.UPLOAD_DIR, media.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Lỗi khi xóa file vật lý:', err);
      }
    }

    await prisma.media.delete({ where: { id: mediaId } });
    return true;
  }
}
