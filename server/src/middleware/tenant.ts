import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorisedError } from '../utils/errors';

export const enforceTenant = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorisedError());
  }

  // If a specific orgId is supplied in the URL params, ensure it matches the token
  if (req.params.orgId && req.params.orgId !== req.user.orgId) {
    return next(new ForbiddenError('Access denied'));
  }

  // The application controllers must still append where: { orgId: req.user.orgId } logically.
  // We cannot automatically append to Prisma queries via express middleware, 
  // but we enforce strict URL param matching here.
  
  next();
};
