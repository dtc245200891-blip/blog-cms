import { Request, Response, NextFunction } from 'express';
import { PostsService } from './posts.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createPostSchema, updatePostSchema, rejectPostSchema } from './posts.validator';

export class PostsController {
  static async getPublicPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const categorySlug = req.query.category as string;
      const tagSlug = req.query.tag as string;
      const authorId = req.query.authorId as string;
      const search = req.query.search as string;
      const sortBy = req.query.sort as 'latest' | 'views' | 'pinned';

      const { posts, meta } = await PostsService.getPublicPosts({
        page,
        limit,
        categorySlug,
        tagSlug,
        authorId,
        search,
        sortBy,
      });

      return sendSuccess(res, posts, 'Lấy danh sách bài viết thành công.', 200, meta);
    } catch (err: any) {
      next(err);
    }
  }

  static async getPostBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const currentUserId = req.user?.id;
      const post = await PostsService.getPostBySlug(req.params.slug, currentUserId, clientIp);
      return sendSuccess(res, post, 'Lấy chi tiết bài viết thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async getManagePosts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const authorId = req.query.authorId as string;
      const categoryId = req.query.categoryId as string;

      const { posts, meta } = await PostsService.getManagePosts(
        { id: req.user.id, role: req.user.role },
        { page, limit, status, search, authorId, categoryId }
      );

      return sendSuccess(res, posts, 'Lấy danh sách bài viết quản trị thành công.', 200, meta);
    } catch (err: any) {
      next(err);
    }
  }

  static async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = createPostSchema.parse(req.body);
      const post = await PostsService.createPost(
        { id: req.user.id, role: req.user.role },
        validated
      );
      return sendSuccess(res, post, 'Tạo bài viết mới thành công!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updatePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const validated = updatePostSchema.parse(req.body);
      const post = await PostsService.updatePost(
        { id: req.user.id, role: req.user.role },
        req.params.id,
        validated
      );
      return sendSuccess(res, post, 'Cập nhật bài viết thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async submitForReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const post = await PostsService.submitForReview(
        { id: req.user.id, role: req.user.role },
        req.params.id
      );
      return sendSuccess(res, post, 'Đã gửi bài viết để biên tập viên kiểm duyệt.');
    } catch (err: any) {
      next(err);
    }
  }

  static async approvePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const post = await PostsService.approvePost(
        { id: req.user.id, role: req.user.role },
        req.params.id
      );
      return sendSuccess(res, post, 'Phê duyệt và xuất bản bài viết thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async rejectPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const { reason } = rejectPostSchema.parse(req.body);
      const post = await PostsService.rejectPost(
        { id: req.user.id, role: req.user.role },
        req.params.id,
        reason
      );
      return sendSuccess(res, post, 'Đã từ chối duyệt bài viết.');
    } catch (err: any) {
      next(err);
    }
  }

  static async publishPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const post = await PostsService.publishPost(
        { id: req.user.id, role: req.user.role },
        req.params.id
      );
      return sendSuccess(res, post, 'Xuất bản bài viết thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async archivePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const post = await PostsService.archivePost(
        { id: req.user.id, role: req.user.role },
        req.params.id
      );
      return sendSuccess(res, post, 'Đã chuyển bài viết vào kho lưu trữ.');
    } catch (err: any) {
      next(err);
    }
  }

  static async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      await PostsService.deletePost(
        { id: req.user.id, role: req.user.role },
        req.params.id
      );
      return sendSuccess(res, null, 'Xóa bài viết thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async toggleBookmark(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const result = await PostsService.toggleBookmark(req.user.id, req.params.id);
      return sendSuccess(res, result, result.message);
    } catch (err: any) {
      next(err);
    }
  }

  static async getBookmarks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Chưa đăng nhập.', 401);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const result = await PostsService.getBookmarks(req.user.id, page, limit);
      return sendSuccess(res, result.bookmarks, 'Lấy danh sách bài viết đã lưu thành công.', 200, result.meta);
    } catch (err: any) {
      next(err);
    }
  }
}
