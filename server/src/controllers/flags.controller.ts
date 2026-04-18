import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createFlagSchema, updateFlagSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getFlags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const { status, severity, flagType, page = '1', limit = '20' } = req.query;
    const whereClause: any = { orgId: req.user.orgId };

    if (status) whereClause.status = status;
    if (severity) whereClause.severity = severity;
    if (flagType) whereClause.flagType = flagType;

    const skip = (Number(page) - 1) * Number(limit);

    const [flags, total] = await Promise.all([
      prisma.flag.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.flag.count({ where: whereClause }),
    ]);

    return res.json({
      data: {
        flags,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createFlagSchema.parse(req.body);

    const flag = await prisma.flag.create({
      data: {
        ...data,
        orgId: req.user.orgId,
        raisedById: req.user.userId,
      },
    });

    res.locals.entityId = flag.id;
    res.locals.auditDetail = { flagCategory: flag.flagCategory };

    return res.status(201).json({ data: flag });
  } catch (error) {
    next(error);
  }
};

export const updateFlagStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateFlagSchema.parse(req.body);

    const existing = await prisma.flag.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
    });

    if (!existing) throw new NotFoundError('Flag not found');

    const updateData: any = { status: data.status };
    if (data.status === 'resolved') {
      updateData.resolvedById = req.user.userId;
      updateData.resolvedAt = new Date();
    }

    const updated = await prisma.flag.update({
      where: { id: existing.id },
      data: updateData,
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { status: updated.status };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
