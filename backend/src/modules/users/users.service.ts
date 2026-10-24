import { prisma } from '../../config/prisma';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError';

export class UsersService {
  static async getUsers(options: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.role) {
      where.role = options.role;
    }
    if (options.status === 'active') {
      where.isActive = true;
    } else if (options.status === 'locked') {
      where.isActive = false;
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

  static async getUserStats() {
    const [total, active, locked, admins, editors, authors, readers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'EDITOR' } }),
      prisma.user.count({ where: { role: 'AUTHOR' } }),
      prisma.user.count({ where: { role: 'READER' } }),
    ]);

    return {
      total,
      active,
      locked,
      roles: {
        admins,
        editors,
        authors,
        readers,
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
      throw new AppError('Không tìm thấy người dùng.', 404);
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

  static async createUserByAdmin(
    adminId: string,
    data: { fullName: string; email: string; username: string; password: string; role?: string; bio?: string }
  ) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existing) {
      if (existing.email === data.email) {
        throw new AppError('Email này đã được sử dụng trong hệ thống.', 400);
      }
      throw new AppError('Tên đăng nhập này đã tồn tại.', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        passwordHash,
        role: data.role || 'READER',
        bio: data.bio || null,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'ADMIN_CREATE_USER',
        entity: 'USER',
        entityId: newUser.id,
        details: `Quản trị viên đã tạo mới tài khoản ${newUser.username} với vai trò ${newUser.role}`,
      },
    });

    return newUser;
  }

  static async adminUpdateUser(
    adminId: string,
    targetUserId: string,
    data: { role?: string; isActive?: boolean }
  ) {
    // Không cho phép tự khóa tài khoản của chính mình
    if (adminId === targetUserId && data.isActive === false) {
      throw new AppError('Quản trị viên không thể tự khóa tài khoản của chính mình.', 400);
    }

    // Không cho phép tự hạ quyền ADMIN của chính mình
    if (adminId === targetUserId && data.role && data.role !== 'ADMIN') {
      throw new AppError('Quản trị viên không thể tự hạ quyền ADMIN của chính mình.', 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new AppError('Người dùng không tồn tại.', 404);
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
        details: `Quản trị viên cập nhật tài khoản ${targetUser.username}: role=${data.role || targetUser.role}, isActive=${data.isActive ?? targetUser.isActive}`,
      },
    });

    return updated;
  }

  static async resetPasswordByAdmin(adminId: string, targetUserId: string, newPassword: string) {
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new AppError('Người dùng không tồn tại.', 404);
    }

    if (newPassword.length < 6) {
      throw new AppError('Mật khẩu mới phải có ít nhất 6 ký tự.', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { passwordHash },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'ADMIN_RESET_PASSWORD',
        entity: 'USER',
        entityId: targetUserId,
        details: `Quản trị viên đặt lại mật khẩu cho tài khoản ${targetUser.username}`,
      },
    });

    return { id: targetUser.id, username: targetUser.username, fullName: targetUser.fullName };
  }

  static async deleteUserByAdmin(adminId: string, targetUserId: string) {
    if (adminId === targetUserId) {
      throw new AppError('Quản trị viên không thể tự xóa tài khoản của chính mình.', 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        _count: {
          select: { posts: true, comments: true },
        },
      },
    });

    if (!targetUser) {
      throw new AppError('Người dùng không tồn tại.', 404);
    }

    // Xóa các bảng liên kết an toàn: bookmarks, notifications, audit_logs (hoặc để audit_logs set null)
    await prisma.$transaction([
      prisma.bookmark.deleteMany({ where: { userId: targetUserId } }),
      prisma.notification.deleteMany({ where: { userId: targetUserId } }),
      prisma.comment.deleteMany({ where: { authorId: targetUserId } }),
      // Nếu có bài viết, chuyển quyền sở hữu bài viết sang Admin để tránh mồ côi dữ liệu
      prisma.post.updateMany({
        where: { authorId: targetUserId },
        data: { authorId: adminId },
      }),
      prisma.user.delete({ where: { id: targetUserId } }),
    ]);

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'ADMIN_DELETE_USER',
        entity: 'USER',
        entityId: targetUserId,
        details: `Quản trị viên đã xóa tài khoản ${targetUser.username} (${targetUser.email})`,
      },
    });

    return { success: true };
  }
}
