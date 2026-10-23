import { Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class DashboardController {
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const stats = await DashboardService.getStats({ id: req.user.id, role: req.user.role });
      return sendSuccess(res, stats, 'Lấy dữ liệu thống kê bảng điều khiển thành công.');
    } catch (err: any) {
      next(err);
    }
  }
}
