import { Router } from 'express';
import { 
  getAlerts, 
  createAlert, 
  getAlertById, 
  updateAlert 
} from '../controllers/alerts.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getAlerts);
router.post('/', createAlert, auditLog('alert_created', 'alert'));
router.get('/:id', getAlertById);
router.patch('/:id', updateAlert, auditLog('alert_updated', 'alert'));

export default router;
