import { Router } from 'express';
import { MediaController } from './media.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';
import { uploadImage } from '../../middlewares/upload.middleware';

const router = Router();

// Tải ảnh lên (Author, Editor, Admin)
router.post('/upload', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), uploadImage.single('file'), MediaController.upload);

// Xem danh sách media đã tải lên
router.get('/', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), MediaController.getMediaList);

// Xóa media
router.delete('/:id', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), MediaController.deleteMedia);

export default router;
