import { prisma } from '../../config/prisma';
import { generateSlug } from '../../utils/slugify';
import sanitizeHtml from 'sanitize-html';

export class PostsService {
  private static sanitizeContent(content: string): string {
    return sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span'
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
        code: ['class'],
        span: ['class', 'style'],
        a: ['href', 'name', 'target', 'rel'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'data'],
    });
  }

  static async getPublicPosts(options: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    tagSlug?: string;
    authorId?: string;
    search?: string;
    sortBy?: 'latest' | 'views' | 'pinned';
  }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (options.categorySlug) {
      where.category = { slug: options.categorySlug };
    }

    if (options.tagSlug) {
      where.postTags = {
        some: { tag: { slug: options.tagSlug } },
      };
    }

    if (options.authorId) {
      where.authorId = options.authorId;
    }

    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { excerpt: { contains: options.search } },
        { content: { contains: options.search } },
      ];
    }

    let orderBy: any = [{ isPinned: 'desc' }, { publishedAt: 'desc' }];
    if (options.sortBy === 'views') {
      orderBy = [{ viewsCount: 'desc' }, { publishedAt: 'desc' }];
    } else if (options.sortBy === 'latest') {
      orderBy = [{ publishedAt: 'desc' }];
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          status: true,
          isPinned: true,
          viewsCount: true,
          publishedAt: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          postTags: {
            select: {
              tag: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
          _count: {
            select: {
              comments: { where: { status: 'APPROVED' } },
              bookmarks: true,
            },
          },
        },
      }),
    ]);

    const formattedPosts = posts.map((p) => ({
      ...p,
      tags: p.postTags.map((pt) => pt.tag),
      postTags: undefined,
    }));

    return {
      posts: formattedPosts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPostBySlug(slug: string, currentUserId?: string, clientIp?: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        postTags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: {
          select: {
            comments: { where: { status: 'APPROVED' } },
            bookmarks: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error('Bài viết không tồn tại.');
    }

    // Nếu không phải PUBLISHED, chỉ tác giả, biên tập viên hoặc quản trị viên mới được xem
    if (post.status !== 'PUBLISHED') {
      if (!currentUserId) {
        throw new Error('Bài viết đang ở trạng thái không công khai.');
      }
      const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
      if (
        !currentUser ||
        (currentUser.role === 'READER' && post.authorId !== currentUserId) ||
        (currentUser.role === 'AUTHOR' && post.authorId !== currentUserId)
      ) {
        throw new Error('Bạn không có quyền xem bài viết chưa công khai này.');
      }
    }

    // Tăng lượt xem (chỉ khi là PUBLISHED)
    if (post.status === 'PUBLISHED') {
      await prisma.$transaction([
        prisma.post.update({
          where: { id: post.id },
          data: { viewsCount: { increment: 1 } },
        }),
        prisma.postView.create({
          data: {
            postId: post.id,
            ipHash: clientIp ? Buffer.from(clientIp).toString('base64').substring(0, 32) : null,
          },
        }),
      ]);
    }

    // Kiểm tra xem người dùng hiện tại đã lưu bài viết chưa
    let isBookmarked = false;
    if (currentUserId) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId: post.id,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    // Lấy bài viết liên quan (cùng danh mục)
    const relatedPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        categoryId: post.categoryId,
        NOT: { id: post.id },
      },
      take: 4,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        publishedAt: true,
        author: { select: { fullName: true, avatarUrl: true } },
      },
    });

    return {
      ...post,
      tags: post.postTags.map((pt) => pt.tag),
      postTags: undefined,
      isBookmarked,
      relatedPosts,
    };
  }

  static async getManagePosts(
    user: { id: string; role: string },
    options: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      authorId?: string;
      categoryId?: string;
    }
  ) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Tác giả chỉ thấy bài của mình
    if (user.role === 'AUTHOR') {
      where.authorId = user.id;
    } else if (options.authorId) {
      where.authorId = options.authorId;
    }

    if (options.status) {
      where.status = options.status;
    }

    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { excerpt: { contains: options.search } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { comments: true, bookmarks: true } },
        },
      }),
    ]);

    const formattedPosts = posts.map((p) => ({
      ...p,
      tags: p.postTags.map((pt) => pt.tag),
      postTags: undefined,
    }));

    return {
      posts: formattedPosts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async createPost(
    user: { id: string; role: string },
    data: {
      title: string;
      excerpt?: string | null;
      content: string;
      featuredImage?: string | null;
      categoryId?: string | null;
      tagIds?: string[];
      status?: string;
      scheduledAt?: string | null;
      isPinned?: boolean;
      allowComments?: boolean;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }
  ) {
    let slug = generateSlug(data.title);
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${generateSlug(data.title)}-${counter++}`;
    }

    const cleanContent = this.sanitizeContent(data.content);

    // Quyền trạng thái: Chỉ ADMIN & EDITOR mới có thể xuất bản trực tiếp
    let postStatus = data.status || 'DRAFT';
    let publishedAt: Date | null = null;
    if (postStatus === 'PUBLISHED') {
      if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
        postStatus = 'PENDING'; // Tác giả gửi xuất bản sẽ thành chờ duyệt
      } else {
        publishedAt = new Date();
      }
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: cleanContent,
        featuredImage: data.featuredImage,
        categoryId: data.categoryId || null,
        authorId: user.id,
        status: postStatus,
        publishedAt,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        isPinned: (user.role === 'ADMIN' || user.role === 'EDITOR') ? !!data.isPinned : false,
        allowComments: data.allowComments !== false,
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.excerpt,
        postTags: data.tagIds && data.tagIds.length > 0
          ? {
              create: data.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: {
        category: true,
        author: { select: { id: true, fullName: true, username: true } },
        postTags: { select: { tag: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE_POST',
        entity: 'POST',
        entityId: post.id,
        details: `Tạo bài viết "${post.title}" ở trạng thái ${post.status}`,
      },
    });

    return post;
  }

  static async updatePost(
    user: { id: string; role: string },
    postId: string,
    data: any
  ) {
    const existing = await prisma.post.findUnique({
      where: { id: postId },
      include: { postTags: true },
    });

    if (!existing) {
      throw new Error('Bài viết không tồn tại.');
    }

    // Kiểm tra quyền sửa: Tác giả chỉ được sửa bài của mình
    if (user.role === 'AUTHOR' && existing.authorId !== user.id) {
      throw new Error('Bạn không có quyền chỉnh sửa bài viết của người khác.');
    }

    let slug = existing.slug;
    if (data.title && data.title !== existing.title) {
      slug = generateSlug(data.title);
      let counter = 1;
      while (await prisma.post.findFirst({ where: { slug, NOT: { id: postId } } })) {
        slug = `${generateSlug(data.title)}-${counter++}`;
      }
    }

    let cleanContent = existing.content;
    if (data.content) {
      cleanContent = this.sanitizeContent(data.content);
    }

    // Cập nhật thẻ liên kết
    if (data.tagIds) {
      await prisma.postTag.deleteMany({ where: { postId } });
      if (data.tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: data.tagIds.map((tagId: string) => ({ postId, tagId })),
        });
      }
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(data.title && { title: data.title, slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.content && { content: cleanContent }),
        ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.allowComments !== undefined && { allowComments: data.allowComments }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
        ...((user.role === 'ADMIN' || user.role === 'EDITOR') && data.isPinned !== undefined && { isPinned: data.isPinned }),
      },
      include: {
        category: true,
        author: { select: { id: true, fullName: true, username: true } },
        postTags: { select: { tag: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_POST',
        entity: 'POST',
        entityId: postId,
        details: `Cập nhật bài viết "${updated.title}"`,
      },
    });

    return updated;
  }

  static async submitForReview(user: { id: string; role: string }, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    if (user.role === 'AUTHOR' && post.authorId !== user.id) {
      throw new Error('Bạn chỉ có thể gửi bài viết của chính mình.');
    }

    if (post.status !== 'DRAFT' && post.status !== 'REJECTED') {
      throw new Error(`Bài viết đang ở trạng thái "${post.status}", không thể gửi duyệt.`);
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: 'PENDING', rejectionReason: null },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'SUBMIT_POST_REVIEW',
        entity: 'POST',
        entityId: postId,
        details: `Gửi duyệt bài viết "${post.title}"`,
      },
    });

    return updated;
  }

  static async approvePost(user: { id: string; role: string }, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: post.publishedAt || new Date(),
        rejectionReason: null,
      },
    });

    // Gửi thông báo đến tác giả
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        title: 'Bài viết đã được duyệt và xuất bản',
        message: `Bài viết "${post.title}" của bạn đã được ${user.role === 'ADMIN' ? 'Quản trị viên' : 'Biên tập viên'} phê duyệt và xuất bản công khai.`,
        type: 'SUCCESS',
        link: `/posts/${post.slug}`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'APPROVE_POST',
        entity: 'POST',
        entityId: postId,
        details: `Duyệt bài viết "${post.title}" thành công.`,
      },
    });

    return updated;
  }

  static async rejectPost(user: { id: string; role: string }, postId: string, reason: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
    });

    await prisma.notification.create({
      data: {
        userId: post.authorId,
        title: 'Bài viết bị từ chối phê duyệt',
        message: `Bài viết "${post.title}" của bạn chưa được duyệt với lý do: "${reason}". Vui lòng chỉnh sửa và gửi lại.`,
        type: 'DANGER',
        link: '/admin/posts',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REJECT_POST',
        entity: 'POST',
        entityId: postId,
        details: `Từ chối bài viết "${post.title}". Lý do: ${reason}`,
      },
    });

    return updated;
  }

  static async publishPost(user: { id: string; role: string }, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PUBLISH_POST',
        entity: 'POST',
        entityId: postId,
        details: `Xuất bản trực tiếp bài viết "${post.title}"`,
      },
    });

    return updated;
  }

  static async archivePost(user: { id: string; role: string }, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    if (user.role === 'AUTHOR' && post.authorId !== user.id) {
      throw new Error('Bạn không có quyền lưu trữ bài viết này.');
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: 'ARCHIVED' },
    });

    return updated;
  }

  static async deletePost(user: { id: string; role: string }, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Bài viết không tồn tại.');

    if (user.role === 'AUTHOR' && post.authorId !== user.id) {
      throw new Error('Bạn chỉ có thể xóa bài viết của mình.');
    }

    await prisma.post.delete({ where: { id: postId } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE_POST',
        entity: 'POST',
        entityId: postId,
        details: `Xóa bài viết "${post.title}"`,
      },
    });

    return true;
  }

  static async toggleBookmark(userId: string, postId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false, message: 'Đã bỏ lưu bài viết.' };
    } else {
      await prisma.bookmark.create({
        data: { userId, postId },
      });
      return { bookmarked: true, message: 'Đã lưu bài viết vào danh sách yêu thích.' };
    }
  }

  static async getBookmarks(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, bookmarks] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.bookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              featuredImage: true,
              publishedAt: true,
              author: { select: { fullName: true, avatarUrl: true } },
              category: { select: { name: true, slug: true } },
            },
          },
        },
      }),
    ]);

    return {
      bookmarks: bookmarks.map((b) => b.post),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
