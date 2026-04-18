import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/stats', getDashboardStats);

export default router;
