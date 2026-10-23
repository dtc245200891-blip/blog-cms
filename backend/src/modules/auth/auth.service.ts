import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { signToken } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';

export class AuthService {
  static async register(data: { email: string; username: string; password: string; fullName: string }) {
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      throw new AppError('Địa chỉ email này đã được sử dụng.', 400);
    }

    const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUsername) {
      throw new AppError('Tên đăng nhập này đã được sử dụng.', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        fullName: data.fullName,
        role: 'READER', // Mặc định tài khoản đăng ký mới là Độc giả
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // Tạo thông báo chào mừng
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Chào mừng bạn đến với ICTU Blog/CMS!',
        message: 'Tài khoản của bạn đã được đăng ký thành công. Hãy khám phá và lưu lại những bài viết bổ ích.',
        type: 'SUCCESS',
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    });

    return { user, token };
  }

  static async login(identifier: string, password: string, clientIp?: string, userAgent?: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new AppError('Thông tin đăng nhập không chính xác.', 400);
    }

    if (!user.isActive) {
      throw new AppError('Tài khoản của bạn đã bị vô hiệu hóa hoặc khóa.', 403);
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Thông tin đăng nhập không chính xác.', 400);
    }

    // Ghi audit log đăng nhập
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'USER',
        entityId: user.id,
        details: `Người dùng ${user.username} (${user.role}) đăng nhập thành công.`,
        ipAddress: clientIp,
        userAgent,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { user: safeUser, token };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      },
    });

    if (!user) {
      throw new Error('Không tìm thấy thông tin tài khoản.');
    }

    return user;
  }

  static async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('Người dùng không tồn tại.');
    }

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không chính xác.');
    }

    const newHash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CHANGE_PASSWORD',
        entity: 'USER',
        entityId: userId,
        details: 'Đổi mật khẩu thành công.',
      },
    });

    return true;
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Vì lý do bảo mật, không tiết lộ email có tồn tại hay không
      return { message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    return {
      message: 'Mã xác thực đặt lại mật khẩu đã được tạo (Giả lập gửi email).',
      resetToken: token, // Dùng cho môi trường demo / testing
    };
  }

  static async resetPassword(token: string, newPass: string) {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw new Error('Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    }

    const user = await prisma.user.findUnique({ where: { email: resetRecord.email } });
    if (!user) {
      throw new Error('Tài khoản không tồn tại.');
    }

    const newHash = await bcrypt.hash(newPass, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return true;
  }
}
