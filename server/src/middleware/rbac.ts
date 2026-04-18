import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorisedError } from '../utils/errors';

export const ADMIN_ONLY = ['admin'];
export const MANAGER_AND_ABOVE = ['admin', 'compliance_manager'];
export const ANALYST_AND_ABOVE = ['admin', 'compliance_manager', 'analyst', 'reviewer'];
export const ALL_ROLES = ['admin', 'compliance_manager', 'analyst', 'reviewer', 'auditor'];

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorisedError());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};
