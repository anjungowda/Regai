import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { UnauthorisedError } from '../utils/errors';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const orgId = req.user.orgId;
    const userId = req.user.userId;

    const [
      totalCases,
      myActiveCases,
      openAlerts,
      pendingTasks,
      recentActivity
    ] = await Promise.all([
      prisma.case.count({ where: { orgId } }),
      prisma.case.count({ 
        where: { orgId, assignedToId: userId, status: { notIn: ['closed'] } } 
      }),
      prisma.alert.count({ where: { orgId, status: 'open' } }),
      prisma.task.count({ where: { orgId, assignedToId: userId, isComplete: false } }),
      prisma.auditLog.findMany({
        where: { orgId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, actionType: true, entityType: true, userFullName: true, createdAt: true }
      })
    ]);

    return res.json({
      data: {
        totalCases,
        myActiveCases,
        openAlerts,
        pendingTasks,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};
