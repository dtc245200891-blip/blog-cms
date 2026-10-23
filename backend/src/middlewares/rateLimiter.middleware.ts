import rateLimit from 'express-rate-limit';

// Giới hạn chung cho toàn hệ thống
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 300, // tối đa 300 requests mỗi 15 phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu từ địa chỉ IP này. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn nghiêm ngặt chống dò mật khẩu cho Auth (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 30, // tối đa 30 lần thử
  message: {
    success: false,
    message: 'Đã thử đăng nhập/đăng ký quá nhiều lần. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn chống spam bình luận
export const commentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 10, // tối đa 10 bình luận mỗi phút
  message: {
    success: false,
    message: 'Bạn đang gửi bình luận quá nhanh. Vui lòng chờ 1 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
