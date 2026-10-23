import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

// Lấy danh sách người dùng (Chỉ ADMIN)
router.get('/', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.getUsers);

// Cập nhật profile người dùng hiện tại
router.patch('/profile', authenticate, UsersController.updateProfile);

// Lấy thông tin người dùng theo ID (Công khai / Tác giả)
router.get('/:id', UsersController.getUserById);

// Quản trị viên cập nhật vai trò, khóa tài khoản
router.patch('/:id/admin', authenticate, authorizeRoles(ROLES.ADMIN), UsersController.adminUpdateUser);

export default router;
