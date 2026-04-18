import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  refresh, 
  forgotPassword, 
  resetPassword, 
  getMe 
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.post('/register', authLimiter, register, auditLog('user_registered', 'user'));
router.post('/login', authLimiter, login, auditLog('login', 'user'));
router.post('/logout', requireAuth, logout, auditLog('logout', 'user'));
router.post('/refresh', refresh);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', requireAuth, getMe);

export default router;
