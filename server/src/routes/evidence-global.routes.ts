import { Router } from 'express';
import { downloadEvidence } from '../controllers/evidence.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';

const router = Router();

router.use(requireAuth, enforceTenant);

// Global route for downloading specific evidence without knowing caseId context
router.get('/:evidenceId/download', downloadEvidence);

export default router;
