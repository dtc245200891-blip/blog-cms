import { Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class NotificationsController {
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const data = await NotificationsService.getNotifications(req.user.id);
      return sendSuccess(res, data, 'Lấy danh sách thông báo thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      await NotificationsService.markAsRead(req.user.id, req.params.id);
      return sendSuccess(res, null, 'Đánh dấu đã đọc thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      await NotificationsService.markAllAsRead(req.user.id);
      return sendSuccess(res, null, 'Đánh dấu tất cả là đã đọc.');
    } catch (err: any) {
      next(err);
    }
  }
}
