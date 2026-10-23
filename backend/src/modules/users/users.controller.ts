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

const adminUpdateUserSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'READER']).optional(),
  isActive: z.boolean().optional(),
});

export class UsersController {
  static async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string;
      const role = req.query.role as string;

      const { users, meta } = await UsersService.getUsers({ page, limit, search, role });
      return sendSuccess(res, users, 'Lấy danh sách người dùng thành công.', 200, meta);
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
}
