import { Response, NextFunction } from 'express';
import { MediaService } from './media.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class MediaController {
  static async upload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      if (!req.file) return sendError(res, 'Vui lòng chọn tệp ảnh để tải lên.', 400);

      const media = await MediaService.uploadFile({ id: req.user.id }, req.file);
      return sendSuccess(res, media, 'Tải tệp lên thành công!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async getMediaList(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
      const search = req.query.search as string;

      const { media, meta } = await MediaService.getMediaList({ page, limit, search });
      return sendSuccess(res, media, 'Lấy danh sách tệp thành công.', 200, meta);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteMedia(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      await MediaService.deleteMedia({ id: req.user.id, role: req.user.role }, req.params.id);
      return sendSuccess(res, null, 'Xóa tệp thành công!');
    } catch (err: any) {
      next(err);
    }
  }
}
