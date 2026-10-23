import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';
import { prisma } from '../config/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    username: string;
    fullName: string;
  };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  // 1. Kiểm tra header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    // 2. Kiểm tra Cookie HttpOnly
    token = req.cookies.access_token;
  }

  if (!token) {
    return sendError(res, 'Yêu cầu đăng nhập để truy cập tài nguyên này.', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return sendError(res, 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.', 401);
  }

  // Xác thực user tồn tại và đang hoạt động trong DB
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, username: true, fullName: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return sendError(res, 'Tài khoản không tồn tại hoặc đã bị khóa.', 403);
  }

  req.user = {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
  };

  next();
}

export async function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, username: true, fullName: true, role: true, isActive: true },
      });
      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        };
      }
    }
  }

  next();
}
