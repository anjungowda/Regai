import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const auditLog = (actionType: string, entityType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    // We attach an event listener to 'finish' so the log is written
    // *after* the controller finishes successfully.
    res.on('finish', async () => {
      // Only log successful operations
      if (res.statusCode >= 400) {
        return;
      }

      if (!req.user) return; // Should not happen on protected routes

      try {
        const entityId = req.params.id || res.locals.entityId || null;
        const detail = res.locals.auditDetail || null;

        await prisma.auditLog.create({
          data: {
            orgId: req.user.orgId,
            userId: req.user.userId,
            userFullName: req.user.email, // Best fallback if we don't fetch full user repeatedly
            userRole: req.user.role,
            actionType,
            entityType,
            entityId,
            detail,
            ipAddress: req.ip || null,
            userAgent: req.headers['user-agent'] || null,
          }
        });
      } catch (error) {
        // Must never fail the user's request. Just log the error.
        logger.error('Audit Logging Failed:', error);
      }
    });

    next();
  };
};
