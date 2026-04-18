import { Router } from 'express';
import { getNotes, createNote } from '../controllers/notes.controller';
import { requireAuth } from '../middleware/auth';
import { enforceTenant } from '../middleware/tenant';
import { auditLog } from '../middleware/auditLogger';

// Note: must use mergeParams: true to access :caseId from parent router if mounted that way,
// or we mount as /api/cases/:caseId/notes directly in app.ts
const router = Router({ mergeParams: true });

router.use(requireAuth, enforceTenant);

router.get('/', getNotes);
router.post('/', createNote, auditLog('note_created', 'note'));

export default router;
