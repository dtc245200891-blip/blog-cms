import { prisma } from '../../config/prisma';

export class AuditService {
  static async getLogs(options: { page?: number; limit?: number; action?: string; entity?: string }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.action) where.action = options.action;
    if (options.entity) where.entity = options.entity;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true, username: true, role: true } },
        },
      }),
    ]);

    return {
      logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
