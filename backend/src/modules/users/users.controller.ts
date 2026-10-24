import { Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { z } from 'zod';

const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên ít nhất 2 ký tự.').optional(),
  bio: z.string().max(500, 'Tiểu sử tối đa 500 ký tự.').optional().nullable(),
  avatarUrl: z.string().url('Đường dẫn ảnh đại diện không hợp lệ.').optional().nullable(),
});

const createUserSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên ít nhất 2 ký tự.'),
  email: z.string().email('Email không đúng định dạng.'),
  username: z.string().min(3, 'Tên đăng nhập ít nhất 3 ký tự.').regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'READER']).default('READER'),
  bio: z.string().max(500).optional(),
});

const adminUpdateUserSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'READER']).optional(),
  isActive: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),
});

export class UsersController {
  static async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string;
      const role = req.query.role as string;
      const status = req.query.status as string;

      const { users, meta } = await UsersService.getUsers({ page, limit, search, role, status });
      return sendSuccess(res, users, 'Lấy danh sách người dùng thành công.', 200, meta);
    } catch (err: any) {
      next(err);
    }
  }

  static async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await UsersService.getUserStats();
      return sendSuccess(res, stats, 'Lấy số liệu thống kê người dùng thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UsersService.getUserById(req.params.id);
      return sendSuccess(res, user, 'Lấy chi tiết người dùng thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = createUserSchema.parse(req.body);
      const newUser = await UsersService.createUserByAdmin(req.user.id, validated);
      return sendSuccess(res, newUser, 'Tạo người dùng mới thành công!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = updateProfileSchema.parse(req.body);
      const updated = await UsersService.updateProfile(req.user.id, {
        fullName: validated.fullName,
        bio: validated.bio ?? undefined,
        avatarUrl: validated.avatarUrl ?? undefined,
      });
      return sendSuccess(res, updated, 'Cập nhật hồ sơ cá nhân thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async adminUpdateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = adminUpdateUserSchema.parse(req.body);
      const updated = await UsersService.adminUpdateUser(req.user.id, req.params.id, validated);
      return sendSuccess(res, updated, 'Cập nhật tài khoản người dùng thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = resetPasswordSchema.parse(req.body);
      const result = await UsersService.resetPasswordByAdmin(req.user.id, req.params.id, validated.newPassword);
      return sendSuccess(res, result, 'Đặt lại mật khẩu cho người dùng thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      await UsersService.deleteUserByAdmin(req.user.id, req.params.id);
      return sendSuccess(res, null, 'Xóa tài khoản người dùng thành công!');
    } catch (err: any) {
      next(err);
    }
  }
}
