import { Router } from 'express';
import { 
  getTemplates, 
  createTemplate, 
  getTemplateById, 
  updateTemplate 
} from '../controllers/templates.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, ADMIN_ONLY } from '../middleware/rbac';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getTemplates);
router.get('/:id', getTemplateById);

router.post(
  '/', 
  requireRole(...ADMIN_ONLY), 
  createTemplate, 
  auditLog('template_created', 'organisation')
);

router.patch(
  '/:id', 
  requireRole(...ADMIN_ONLY), 
  updateTemplate, 
  auditLog('template_updated', 'organisation')
);

export default router;
