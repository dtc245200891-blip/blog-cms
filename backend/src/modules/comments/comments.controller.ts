import { Request, Response, NextFunction } from 'express';
import { CommentsService } from './comments.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { z } from 'zod';

const createCommentSchema = z.object({
  postId: z.string().min(1, 'Mã bài viết không được trống.'),
  content: z.string().min(1, 'Nội dung bình luận không được trống.').max(1000, 'Tối đa 1000 ký tự.'),
  parentId: z.string().optional().nullable(),
});

const updateCommentSchema = z.object({
  content: z.string().min(1, 'Nội dung bình luận không được trống.').max(1000),
});

const moderateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']),
});

export class CommentsController {
  static async getCommentsByPost(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await CommentsService.getCommentsByPost(req.params.postId);
      return sendSuccess(res, comments, 'Lấy bình luận bài viết thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async createComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = createCommentSchema.parse(req.body);
      const comment = await CommentsService.createComment(
        { id: req.user.id, role: req.user.role },
        validated
      );
      return sendSuccess(res, comment, 'Bình luận đã được ghi nhận!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = updateCommentSchema.parse(req.body);
      const updated = await CommentsService.updateComment(
        { id: req.user.id, role: req.user.role },
        req.params.id,
        validated.content
      );
      return sendSuccess(res, updated, 'Cập nhật bình luận thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      await CommentsService.deleteComment(
        { id: req.user.id, role: req.user.role },
        req.params.id
      );
      return sendSuccess(res, null, 'Xóa bình luận thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async getManageComments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const { comments, meta } = await CommentsService.getManageComments({ page, limit, status, search });
      return sendSuccess(res, comments, 'Lấy danh sách bình luận quản trị thành công.', 200, meta);
    } catch (err: any) {
      next(err);
    }
  }

  static async moderateComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = moderateSchema.parse(req.body);
      const updated = await CommentsService.moderateComment(
        { id: req.user.id, role: req.user.role },
        req.params.id,
        validated.status
      );
      return sendSuccess(res, updated, 'Kiểm duyệt bình luận thành công!');
    } catch (err: any) {
      next(err);
    }
  }
}
