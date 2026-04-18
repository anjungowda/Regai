import { Router } from 'express';
import { 
  getFlags, 
  createFlag, 
  updateFlagStatus 
} from '../controllers/flags.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getFlags);
router.post('/', createFlag, auditLog('flag_created', 'flag'));
router.patch('/:id', updateFlagStatus, auditLog('flag_updated', 'flag'));

export default router;
