import { Router } from 'express';
import { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../controllers/notifications.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getMyNotifications);
router.post('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
