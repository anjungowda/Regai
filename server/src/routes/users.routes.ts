import { Router } from 'express';
import { 
  getUsers, 
  inviteUser, 
  getUserById, 
  updateUser 
} from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, ADMIN_ONLY, MANAGER_AND_ABOVE } from '../middleware/rbac';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', requireRole(...MANAGER_AND_ABOVE), getUsers);
router.post('/invite', requireRole(...ADMIN_ONLY), inviteUser, auditLog('user_invited', 'user'));
router.get('/:id', requireRole(...MANAGER_AND_ABOVE), getUserById);
router.patch('/:id', requireRole(...ADMIN_ONLY), updateUser, auditLog('user_updated', 'user'));

export default router;
