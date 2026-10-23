import { Request, Response, NextFunction } from 'express';
import { TagsService } from './tags.service';
import { sendSuccess } from '../../utils/response';
import { z } from 'zod';

const tagSchema = z.object({
  name: z.string().min(1, 'Tên thẻ không được để trống.').max(50),
});

export class TagsController {
  static async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await TagsService.getTags();
      return sendSuccess(res, tags, 'Lấy danh sách thẻ thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async getTagBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await TagsService.getTagBySlug(req.params.slug);
      return sendSuccess(res, tag, 'Lấy chi tiết thẻ thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = tagSchema.parse(req.body);
      const tag = await TagsService.createTag(validated.name);
      return sendSuccess(res, tag, 'Tạo thẻ thành công!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = tagSchema.parse(req.body);
      const tag = await TagsService.updateTag(req.params.id, validated.name);
      return sendSuccess(res, tag, 'Cập nhật thẻ thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      await TagsService.deleteTag(req.params.id);
      return sendSuccess(res, null, 'Xóa thẻ thành công!');
    } catch (err: any) {
      next(err);
    }
  }
}
