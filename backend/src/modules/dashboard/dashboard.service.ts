import { prisma } from '../../config/prisma';

export class DashboardService {
  static async getStats(user: { id: string; role: string }) {
    const isAuthorOnly = user.role === 'AUTHOR';
    const postFilter = isAuthorOnly ? { authorId: user.id } : {};

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      pendingPosts,
      totalUsers,
      totalComments,
      pendingComments,
      viewsSum,
      topPosts,
      categoriesWithCount,
      recentLogs,
    ] = await Promise.all([
      prisma.post.count({ where: postFilter }),
      prisma.post.count({ where: { ...postFilter, status: 'PUBLISHED' } }),
      prisma.post.count({ where: { ...postFilter, status: 'DRAFT' } }),
      prisma.post.count({ where: { ...postFilter, status: 'PENDING' } }),
      isAuthorOnly ? Promise.resolve(0) : prisma.user.count(),
      isAuthorOnly
        ? prisma.comment.count({ where: { post: { authorId: user.id } } })
        : prisma.comment.count(),
      isAuthorOnly
        ? prisma.comment.count({ where: { post: { authorId: user.id }, status: 'PENDING' } })
        : prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.post.aggregate({
        where: postFilter,
        _sum: { viewsCount: true },
      }),
      prisma.post.findMany({
        where: { ...postFilter, status: 'PUBLISHED' },
        orderBy: { viewsCount: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          viewsCount: true,
          publishedAt: true,
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: { posts: { where: { status: 'PUBLISHED' } } },
          },
        },
      }),
      isAuthorOnly
        ? Promise.resolve([])
        : prisma.auditLog.findMany({
            take: 7,
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { fullName: true, username: true, role: true } },
            },
          }),
    ]);

    // Thống kê phân bố bài viết theo danh mục cho biểu đồ PieChart
    const categoryChartData = categoriesWithCount.map((c) => ({
      name: c.name,
      value: c._count.posts,
    }));

    return {
      cards: {
        totalPosts,
        publishedPosts,
        draftPosts,
        pendingPosts,
        totalUsers,
        totalComments,
        pendingComments,
        totalViews: viewsSum._sum.viewsCount || 0,
      },
      topPosts,
      categoryChartData,
      recentLogs,
    };
  }
}
