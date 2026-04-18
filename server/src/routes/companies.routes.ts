import { Router } from 'express';
import { 
  getCompanies, 
  createCompany, 
  getCompanyById, 
  updateCompany 
} from '../controllers/companies.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

const router = Router();

router.use(requireAuth, enforceTenant);

router.get('/', getCompanies);

router.post('/', createCompany, auditLog('company_created', 'company'));

router.get('/:id', getCompanyById);

router.patch('/:id', updateCompany, auditLog('company_updated', 'company'));

export default router;
