import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

router.get('/', SettingsController.getSettings);
router.patch('/', authenticate, authorizeRoles(ROLES.ADMIN), SettingsController.updateSettings);

export default router;
