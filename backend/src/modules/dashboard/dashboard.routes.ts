import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

router.get('/stats', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), DashboardController.getStats);

export default router;
