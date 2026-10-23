import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class SettingsController {
  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getSettings();
      return sendSuccess(res, data, 'Lấy cấu hình hệ thống thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const data = await SettingsService.updateSettings(req.user.id, req.body);
      return sendSuccess(res, data, 'Cập nhật cấu hình hệ thống thành công!');
    } catch (err: any) {
      next(err);
    }
  }
}
