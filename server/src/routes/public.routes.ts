import { Router } from 'express';
import { submitContact, submitDemo } from '../controllers/public.controller';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// These are unprotected endpoints but heavily rate-limited
router.post('/contact', apiLimiter, submitContact);
router.post('/demo', apiLimiter, submitDemo);

export default router;
