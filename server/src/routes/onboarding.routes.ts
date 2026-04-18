import { Router } from 'express';
import { completeOnboarding } from '../controllers/onboarding.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.post(
  '/complete',
  requireAuth,
  enforceTenant,
  completeOnboarding,
  auditLog('organisation_updated', 'organisation')
);

export default router;
