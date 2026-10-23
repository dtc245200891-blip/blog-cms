import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

router.get('/', CategoriesController.getCategories);
router.get('/:slug', CategoriesController.getCategoryBySlug);

router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), CategoriesController.createCategory);
router.patch('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), CategoriesController.updateCategory);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), CategoriesController.deleteCategory);

export default router;
