import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
import { sendSuccess } from '../../utils/response';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự.').max(100),
  description: z.string().max(500).optional().nullable(),
  parentId: z.string().optional().nullable(),
});

export class CategoriesController {
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoriesService.getCategories();
      return sendSuccess(res, categories, 'Lấy danh mục thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoriesService.getCategoryBySlug(req.params.slug);
      return sendSuccess(res, category, 'Lấy chi tiết danh mục thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = categorySchema.parse(req.body);
      const created = await CategoriesService.createCategory({
        name: validated.name,
        description: validated.description ?? undefined,
        parentId: validated.parentId ?? undefined,
      });
      return sendSuccess(res, created, 'Tạo danh mục mới thành công!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = categorySchema.partial().parse(req.body);
      const updated = await CategoriesService.updateCategory(req.params.id, validated);
      return sendSuccess(res, updated, 'Cập nhật danh mục thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoriesService.deleteCategory(req.params.id);
      return sendSuccess(res, null, 'Xóa danh mục thành công!');
    } catch (err: any) {
      next(err);
    }
  }
}
