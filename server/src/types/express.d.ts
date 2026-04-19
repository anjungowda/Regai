import { TokenPayload } from './index';

// Extend Express Request to include the authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
