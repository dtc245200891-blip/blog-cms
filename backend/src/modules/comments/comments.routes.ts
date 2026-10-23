import { Router } from 'express';
import { CommentsController } from './comments.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';
import { commentLimiter } from '../../middlewares/rateLimiter.middleware';

const router = Router();

// Lấy bình luận đã duyệt của bài viết (Công khai)
router.get('/post/:postId', CommentsController.getCommentsByPost);

// Tạo bình luận mới (Cần đăng nhập & áp dụng rate limit chống spam)
router.post('/', authenticate, commentLimiter, CommentsController.createComment);

// Sửa bình luận của mình
router.patch('/:id', authenticate, CommentsController.updateComment);

// Xóa bình luận
router.delete('/:id', authenticate, CommentsController.deleteComment);

// Quản lý kiểm duyệt bình luận (Editor & Admin)
router.get('/manage', authenticate, authorizeRoles(ROLES.EDITOR, ROLES.ADMIN), CommentsController.getManageComments);
router.patch('/:id/moderate', authenticate, authorizeRoles(ROLES.EDITOR, ROLES.ADMIN), CommentsController.moderateComment);

export default router;
