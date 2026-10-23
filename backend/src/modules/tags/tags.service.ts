import { prisma } from '../../config/prisma';
import { generateSlug } from '../../utils/slugify';

export class TagsService {
  static async getTags() {
    return prisma.tag.findMany({
      include: {
        _count: {
          select: {
            postTags: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getTagBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: { select: { postTags: true } },
      },
    });

    if (!tag) {
      throw new Error('Thẻ không tồn tại.');
    }
    return tag;
  }

  static async createTag(name: string) {
    let slug = generateSlug(name);
    let counter = 1;
    while (await prisma.tag.findUnique({ where: { slug } })) {
      slug = `${generateSlug(name)}-${counter++}`;
    }

    return prisma.tag.create({
      data: { name, slug },
    });
  }

  static async updateTag(id: string, name: string) {
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Thẻ không tồn tại.');
    }

    let slug = existing.slug;
    if (name !== existing.name) {
      slug = generateSlug(name);
      let counter = 1;
      while (await prisma.tag.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${generateSlug(name)}-${counter++}`;
      }
    }

    return prisma.tag.update({
      where: { id },
      data: { name, slug },
    });
  }

  static async deleteTag(id: string) {
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Thẻ không tồn tại.');
    }

    await prisma.tag.delete({ where: { id } });
    return true;
  }
}
