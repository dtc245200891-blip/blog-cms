import { describe, it, expect } from 'vitest';
import { generateSlug } from '../utils/slugify';
import { signToken, verifyToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../modules/auth/auth.validator';
import bcrypt from 'bcryptjs';

describe('Unit Tests: Tiện ích và Xác thực dữ liệu', () => {
  describe('generateSlug (Hàm sinh Slug chuẩn SEO hỗ trợ tiếng Việt)', () => {
    it('chuyển đổi chuỗi tiếng Việt có dấu thành slug không dấu nối bằng dấu gạch ngang', () => {
      const input = 'Xây dựng hệ thống Blog/CMS hoàn chỉnh và chuyên nghiệp';
      const slug = generateSlug(input);
      expect(slug).toBe('xay-dung-he-thong-blogcms-hoan-chinh-va-chuyen-nghiep');
    });

    it('loại bỏ ký tự đặc biệt và xử lý chữ đ/Đ', () => {
      const input = 'Đại học Công nghệ Thông tin & Truyền thông - ICTU Thái Nguyên';
      const slug = generateSlug(input);
      expect(slug).toBe('dai-hoc-cong-nghe-thong-tin-and-truyen-thong-ictu-thai-nguyen');
    });
  });

  describe('JWT Token & Bcrypt', () => {
    it('ký và giải mã token JWT chính xác', () => {
      const payload = {
        userId: 'test-user-id-123',
        email: 'test@ictu.edu.vn',
        role: 'AUTHOR',
        username: 'test_author',
      };

      const token = signToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    it('băm mật khẩu và so khớp hash thành công', async () => {
      const pass = 'Password@123';
      const hash = await bcrypt.hash(pass, 10);
      const isMatch = await bcrypt.compare(pass, hash);
      const isWrong = await bcrypt.compare('WrongPass', hash);

      expect(isMatch).toBe(true);
      expect(isWrong).toBe(false);
    });
  });

  describe('Zod Validation Schemas', () => {
    it('chấp nhận dữ liệu đăng ký hợp lệ', () => {
      const validData = {
        email: 'sinhvien@ictu.edu.vn',
        username: 'sinhvien_k23l',
        password: 'Password@123',
        fullName: 'Vũ Trọng Nghĩa',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('từ chối đăng ký khi email sai định dạng hoặc mật khẩu quá ngắn', () => {
      const invalidData = {
        email: 'not-an-email',
        username: 'sv',
        password: '123',
        fullName: 'A',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
