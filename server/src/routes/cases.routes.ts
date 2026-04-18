import { Router } from 'express';
import { 
  getCases, 
  createCase, 
  getCaseById, 
  updateCase, 
  closeCase 
} from '../controllers/cases.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, ANALYST_AND_ABOVE, MANAGER_AND_ABOVE } from '../middleware/rbac';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getCases);

router.post(
  '/',
  requireRole(...ANALYST_AND_ABOVE),
  createCase,
  auditLog('case_created', 'case')
);

router.get('/:id', getCaseById);

router.patch(
  '/:id',
  requireRole(...ANALYST_AND_ABOVE),
  updateCase,
  auditLog('case_updated', 'case')
);

router.post(
  '/:id/close',
  requireRole(...MANAGER_AND_ABOVE),
  closeCase,
  auditLog('case_closed', 'case')
);

export default router;
