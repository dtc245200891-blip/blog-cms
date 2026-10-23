import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validator';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { user, token } = await AuthService.register(validatedData);

      // Đặt cookie HttpOnly
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, { user, token }, 'Đăng ký tài khoản thành công!', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const { user, token } = await AuthService.login(
        validatedData.identifier,
        validatedData.password,
        clientIp,
        userAgent
      );

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, { user, token }, 'Đăng nhập thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('access_token');
    return sendSuccess(res, null, 'Đăng xuất thành công!');
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'Chưa đăng nhập.', 401);
      }
      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, user, 'Lấy thông tin người dùng thành công.');
    } catch (err: any) {
      next(err);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'Chưa đăng nhập.', 401);
      }
      const validated = changePasswordSchema.parse(req.body);
      await AuthService.changePassword(req.user.id, validated.oldPassword, validated.newPassword);
      return sendSuccess(res, null, 'Đổi mật khẩu thành công!');
    } catch (err: any) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = forgotPasswordSchema.parse(req.body);
      const result = await AuthService.forgotPassword(validated.email);
      return sendSuccess(res, result, result.message);
    } catch (err: any) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(validated.token, validated.newPassword);
      return sendSuccess(res, null, 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay.');
    } catch (err: any) {
      next(err);
    }
  }
}
