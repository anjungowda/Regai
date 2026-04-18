import { Router } from 'express';
import { getAuditLog, getCaseAuditLog } from '../controllers/auditLog.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, MANAGER_AND_ABOVE, ALL_ROLES } from '../middleware/rbac';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', requireRole(...MANAGER_AND_ABOVE), getAuditLog);
// Note: We'll also let this be accessible via /api/cases/:caseId/audit-log in the cases router usually, but doing it here:
router.get('/case/:caseId', requireRole(...ALL_ROLES), getCaseAuditLog);

export default router;
