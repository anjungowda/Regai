import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createAlertSchema, updateAlertSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const { status, caseId, page = '1', limit = '20' } = req.query;
    const whereClause: any = { orgId: req.user.orgId };

    if (status) whereClause.status = status;
    if (caseId) whereClause.caseId = caseId;

    const skip = (Number(page) - 1) * Number(limit);

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.alert.count({ where: whereClause }),
    ]);

    return res.json({
      data: {
        alerts,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createAlertSchema.parse(req.body);

    const alert = await prisma.alert.create({
      data: {
        ...data,
        orgId: req.user.orgId,
        createdBy: req.user.userId,
      },
    });

    res.locals.entityId = alert.id;
    res.locals.auditDetail = { triggerRule: alert.triggerRule };

    return res.status(201).json({ data: alert });
  } catch (error) {
    next(error);
  }
};

export const getAlertById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const alert = await prisma.alert.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
      include: {
        case: { select: { caseRef: true, status: true } },
      },
    });

    if (!alert) throw new NotFoundError('Alert not found');

    return res.json({ data: alert });
  } catch (error) {
    next(error);
  }
};

export const updateAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateAlertSchema.parse(req.body);

    const alert = await prisma.alert.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
    });

    if (!alert) throw new NotFoundError('Alert not found');

    const updated = await prisma.alert.update({
      where: { id: alert.id },
      data,
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { updatedKeys: Object.keys(data) };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
