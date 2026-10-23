import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Tiêu đề bài viết phải có ít nhất 3 ký tự.').max(255),
  excerpt: z.string().max(500, 'Mô tả ngắn tối đa 500 ký tự.').optional().nullable(),
  content: z.string().min(10, 'Nội dung bài viết phải có ít nhất 10 ký tự.'),
  featuredImage: z.string().url('Đường dẫn ảnh đại diện không hợp lệ.').optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PENDING', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  scheduledAt: z.string().datetime().optional().nullable(),
  isPinned: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  rejectionReason: z.string().optional().nullable(),
});

export const rejectPostSchema = z.object({
  reason: z.string().min(5, 'Lý do từ chối phải có ít nhất 5 ký tự.').max(500),
});
