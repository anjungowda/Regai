import { Router } from 'express';
import { 
  getEvidence, 
  requestUploadUrl, 
  confirmUpload, 
  updateEvidence, 
  deleteEvidence,
  downloadEvidence
} from '../controllers/evidence.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, ANALYST_AND_ABOVE, MANAGER_AND_ABOVE } from '../middleware/rbac';
import { auditLog } from '../middleware/auditLogger';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(requireAuth, enforceTenant);

// Case-scoped routes
router.get('/', getEvidence);
router.post('/upload-url', uploadLimiter, requireRole(...ANALYST_AND_ABOVE), requestUploadUrl);
router.post('/:evidenceId/confirm', requireRole(...ANALYST_AND_ABOVE), confirmUpload, auditLog('evidence_uploaded', 'evidence'));
router.patch('/:evidenceId', requireRole(...ANALYST_AND_ABOVE), updateEvidence, auditLog('evidence_updated', 'evidence'));
router.delete('/:evidenceId', requireRole(...MANAGER_AND_ABOVE), deleteEvidence, auditLog('evidence_deleted', 'evidence'));

export default router;
