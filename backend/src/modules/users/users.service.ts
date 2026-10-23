import { prisma } from '../../config/prisma';

export class UsersService {
  static async getUsers(options: { page?: number; limit?: number; search?: string; role?: string }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.role) {
      where.role = options.role;
    }
    if (options.search) {
      where.OR = [
        { fullName: { contains: options.search } },
        { username: { contains: options.search } },
        { email: { contains: options.search } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          bio: true,
          avatarUrl: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { posts: true, comments: true },
          },
        },
      }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { posts: true, comments: true },
        },
      },
    });

    if (!user) {
      throw new Error('Không tìm thấy người dùng.');
    }
    return user;
  }

  static async updateProfile(userId: string, data: { fullName?: string; bio?: string; avatarUrl?: string }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        role: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  static async adminUpdateUser(
    adminId: string,
    targetUserId: string,
    data: { role?: string; isActive?: boolean }
  ) {
    // Không cho phép tự khóa tài khoản hoặc hạ quyền của chính mình
    if (adminId === targetUserId && data.isActive === false) {
      throw new Error('Quản trị viên không thể tự khóa tài khoản của chính mình.');
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new Error('Người dùng không tồn tại.');
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(data.role && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UPDATE_USER_ROLE_STATUS',
        entity: 'USER',
        entityId: targetUserId,
        details: `Cập nhật người dùng ${targetUser.username}: role=${data.role || targetUser.role}, isActive=${data.isActive ?? targetUser.isActive}`,
      },
    });

    return updated;
  }
}
