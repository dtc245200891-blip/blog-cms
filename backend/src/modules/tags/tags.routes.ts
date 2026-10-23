import { Router } from 'express';
import { TagsController } from './tags.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

router.get('/', TagsController.getTags);
router.get('/:slug', TagsController.getTagBySlug);

router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR), TagsController.createTag);
router.patch('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), TagsController.updateTag);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), TagsController.deleteTag);

export default router;
