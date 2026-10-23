import { Router } from 'express';
import { AuditController } from './audit.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

router.get('/', authenticate, authorizeRoles(ROLES.ADMIN), AuditController.getLogs);

export default router;
