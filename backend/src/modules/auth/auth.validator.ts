import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Địa chỉ email không hợp lệ.'),
  username: z
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự.')
    .max(30, 'Tên đăng nhập tối đa 30 ký tự.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới.'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
    .max(100, 'Mật khẩu tối đa 100 ký tự.'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự.').max(100),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Vui lòng nhập email hoặc tên đăng nhập.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại.'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Địa chỉ email không hợp lệ.'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token không được để trống.'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),
});
