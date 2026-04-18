import { Router } from 'express';
import { 
  getRiskAssessments, 
  createRiskAssessment, 
  getRiskAssessmentById 
} from '../controllers/riskAssessments.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, ANALYST_AND_ABOVE } from '../middleware/rbac';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getRiskAssessments);
router.post('/', requireRole(...ANALYST_AND_ABOVE), createRiskAssessment, auditLog('risk_assessed', 'customer')); // The entityType aligns with what was affected
router.get('/:id', getRiskAssessmentById);

export default router;
