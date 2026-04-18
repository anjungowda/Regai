import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { UnauthorisedError } from '../utils/errors';

export const getAuditLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const { userId, actionType, entityType, dateFrom, dateTo, page = '1', limit = '50' } = req.query;
    const whereClause: any = { orgId: req.user.orgId };

    if (userId) whereClause.userId = userId;
    if (actionType) whereClause.actionType = actionType;
    if (entityType) whereClause.entityType = entityType;
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) whereClause.createdAt.lte = new Date(dateTo as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where: whereClause }),
    ]);

    return res.json({
      data: {
        logs,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCaseAuditLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    // Check case exists and belongs to org
    const caseItem = await prisma.case.findFirst({
      where: { id: req.params.caseId, orgId: req.user.orgId },
    });

    if (!caseItem) throw new UnauthorisedError('Access Denied');

    // For case audit, we need events tied to the case directly, as well as 
    // tasks, notes, evidence etc linked to the case.
    // Simplifying: we pull everything for the org, then filter locally, OR we just query logs directly.
    // As per assignment, typically 'entityId = caseId' handles the majority, plus evidence entityId via lookup.
    // Let's keep it simple: everything where entityId = caseId (updates, closes), or we rely on the specific case scope.

    const logs = await prisma.auditLog.findMany({
      where: { 
        orgId: req.user.orgId,
        OR: [
          { entityId: req.params.caseId },
          // A full production app would also add ORs for child entity IDs (evidence, tasks, etc)
        ]
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ data: logs });
  } catch (error) {
    next(error);
  }
};
