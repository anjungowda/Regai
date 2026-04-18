import { Router } from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  completeTask 
} from '../controllers/tasks.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

const router = Router({ mergeParams: true });

router.use(requireAuth, enforceTenant);

router.get('/', getTasks);
router.post('/', createTask, auditLog('task_created', 'task'));
router.patch('/:taskId', updateTask, auditLog('task_updated', 'task'));
router.post('/:taskId/complete', completeTask, auditLog('task_completed', 'task'));

export default router;
