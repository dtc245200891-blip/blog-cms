import { prisma } from '../../config/prisma';
import sanitizeHtml from 'sanitize-html';

export class CommentsService {
  private static cleanText(content: string): string {
    // Bình luận chỉ cho phép văn bản thuần để bảo mật tuyệt đối chống XSS
    return sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }

  static async getCommentsByPost(postId: string) {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        status: 'APPROVED',
        parentId: null, // Lấy bình luận gốc
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, fullName: true, username: true, avatarUrl: true, role: true },
        },
        replies: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, fullName: true, username: true, avatarUrl: true, role: true },
            },
          },
        },
      },
    });

    return comments;
  }

  static async createComment(
    user: { id: string; role: string },
    data: { postId: string; content: string; parentId?: string | null }
  ) {
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    if (!post.allowComments) {
      throw new Error('Bài viết này đã bị khóa tính năng bình luận.');
    }

    if (data.parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: data.parentId } });
      if (!parentComment || parentComment.postId !== data.postId) {
        throw new Error('Bình luận gốc không hợp lệ.');
      }
    }

    const cleaned = this.cleanText(data.content);
    if (!cleaned) throw new Error('Nội dung bình luận không được để trống.');

    // Kiểm tra cấu hình hệ thống xem bình luận có cần duyệt không
    const approvalSetting = await prisma.setting.findUnique({
      where: { key: 'comments_require_approval' },
    });
    const requireApproval = approvalSetting ? approvalSetting.value === 'true' : false;

    // Nếu người bình luận là ADMIN hoặc EDITOR thì luôn APPROVED; độc giả nếu bật requireApproval thì PENDING
    const status =
      user.role === 'ADMIN' || user.role === 'EDITOR' || !requireApproval ? 'APPROVED' : 'PENDING';

    const comment = await prisma.comment.create({
      data: {
        content: cleaned,
        status,
        postId: data.postId,
        authorId: user.id,
        parentId: data.parentId || null,
      },
      include: {
        author: {
          select: { id: true, fullName: true, username: true, avatarUrl: true, role: true },
        },
      },
    });

    // Thông báo cho tác giả bài viết nếu người bình luận không phải tác giả
    if (post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          title: 'Bình luận mới về bài viết của bạn',
          message: `${user.role} vừa bình luận: "${cleaned.substring(0, 50)}..."`,
          type: 'INFO',
          link: `/posts/${post.slug}`,
        },
      });
    }

    return comment;
  }

  static async updateComment(user: { id: string; role: string }, commentId: string, content: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error('Bình luận không tồn tại.');

    if (user.role !== 'ADMIN' && comment.authorId !== user.id) {
      throw new Error('Bạn không có quyền sửa bình luận này.');
    }

    const cleaned = this.cleanText(content);
    if (!cleaned) throw new Error('Nội dung bình luận không được để trống.');

    return prisma.comment.update({
      where: { id: commentId },
      data: { content: cleaned },
      include: {
        author: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      },
    });
  }

  static async deleteComment(user: { id: string; role: string }, commentId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error('Bình luận không tồn tại.');

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR' && comment.authorId !== user.id) {
      throw new Error('Bạn không có quyền xóa bình luận này.');
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return true;
  }

  static async getManageComments(options: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) where.status = options.status;
    if (options.search) where.content = { contains: options.search };

    const [total, comments] = await Promise.all([
      prisma.comment.count({ where }),
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
      }),
    ]);

    return {
      comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async moderateComment(user: { id: string; role: string }, commentId: string, status: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error('Bình luận không tồn tại.');

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'MODERATE_COMMENT',
        entity: 'COMMENT',
        entityId: commentId,
        details: `Cập nhật trạng thái bình luận sang: ${status}`,
      },
    });

    return updated;
  }
}
