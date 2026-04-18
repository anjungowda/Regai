import { Router } from 'express';
import express from 'express';
import { 
  createCheckoutSession, 
  handleWebhook, 
  getBillingPortal 
} from '../controllers/billing.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { requireRole, ADMIN_ONLY } from '../middleware/rbac';

const router = Router();

// Webhook needs raw body parsing, bypass global JSON parser if applied differently,
// but usually we apply express.raw() specifically on the webhook mount in app.ts.
// Assuming app.ts handles raw body for /api/billing/webhook:
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.use(requireAuth, enforceTenant, requireRole(...ADMIN_ONLY));

router.post('/checkout', createCheckoutSession);
router.get('/portal', getBillingPortal);

export default router;
