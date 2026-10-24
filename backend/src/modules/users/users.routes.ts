import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

// Lấy số liệu thống kê tổng quan người dùng (Chỉ ADMIN)
router.get('/stats', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.getUserStats);

// Lấy danh sách người dùng (Chỉ ADMIN)
router.get('/', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.getUsers);

// Quản trị viên tạo người dùng mới trực tiếp
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.createUser);

// Cập nhật profile người dùng hiện tại
router.patch('/profile', authenticate, UsersController.updateProfile);

// Lấy thông tin người dùng theo ID (Công khai / Tác giả)
router.get('/:id', UsersController.getUserById);

// Quản trị viên cập nhật vai trò (RBAC), khóa / mở khóa tài khoản
router.patch('/:id/admin', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.adminUpdateUser);

// Quản trị viên đặt lại mật khẩu cho người dùng
router.patch('/:id/reset-password', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.resetPassword);

// Quản trị viên xóa tài khoản người dùng
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.deleteUser);

export default router;
