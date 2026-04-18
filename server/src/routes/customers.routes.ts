import { Router } from 'express';
import { 
  getCustomers, 
  createCustomer, 
  getCustomerById, 
  updateCustomer,
  getCustomerCases
} from '../controllers/customers.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getCustomers);

router.post('/', createCustomer, auditLog('customer_created', 'customer'));

router.get('/:id', getCustomerById);

router.patch('/:id', updateCustomer, auditLog('customer_updated', 'customer'));

router.get('/:id/cases', getCustomerCases);

export default router;
