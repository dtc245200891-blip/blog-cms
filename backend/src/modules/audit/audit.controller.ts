import { Response, NextFunction } from 'express';
import { AuditService } from './audit.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuditController {
  static async getLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 15;
      const action = req.query.action as string;
      const entity = req.query.entity as string;

      const { logs, meta } = await AuditService.getLogs({ page, limit, action, entity });
      return sendSuccess(res, logs, 'Lấy nhật ký hoạt động thành công.', 200, meta);
    } catch (err: any) {
      next(err);
    }
  }
}
