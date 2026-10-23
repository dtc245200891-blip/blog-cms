import { prisma } from '../../config/prisma';
import { generateSlug } from '../../utils/slugify';

export class CategoriesService {
  static async getCategories() {
    return prisma.category.findMany({
      include: {
        children: true,
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
        _count: {
          select: { posts: { where: { status: 'PUBLISHED' } } },
        },
      },
    });

    if (!category) {
      throw new Error('Danh mục không tồn tại.');
    }
    return category;
  }

  static async createCategory(data: { name: string; description?: string; parentId?: string }) {
    let slug = generateSlug(data.name);
    let counter = 1;
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${generateSlug(data.name)}-${counter++}`;
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        parentId: data.parentId || null,
      },
    });
  }

  static async updateCategory(id: string, data: { name?: string; description?: string | null; parentId?: string | null }) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Danh mục không tồn tại.');
    }

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      slug = generateSlug(data.name);
      let counter = 1;
      while (await prisma.category.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${generateSlug(data.name)}-${counter++}`;
      }
    }

    // Tránh vòng lặp danh mục cha con (parentId == id)
    if (data.parentId === id) {
      throw new Error('Danh mục cha không thể là chính danh mục này.');
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name, slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
      },
    });
  }

  static async deleteCategory(id: string) {
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { posts: true, children: true } } },
    });

    if (!existing) {
      throw new Error('Danh mục không tồn tại.');
    }

    if (existing._count.posts > 0) {
      throw new Error(`Không thể xóa danh mục đang chứa ${existing._count.posts} bài viết. Hãy chuyển bài viết sang danh mục khác trước.`);
    }

    if (existing._count.children > 0) {
      throw new Error('Không thể xóa danh mục đang có danh mục con.');
    }

    await prisma.category.delete({ where: { id } });
    return true;
  }
}
