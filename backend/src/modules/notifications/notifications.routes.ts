import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, NotificationsController.getNotifications);
router.patch('/:id/read', authenticate, NotificationsController.markAsRead);
router.post('/read-all', authenticate, NotificationsController.markAllAsRead);

export default router;
