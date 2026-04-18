import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createTaskSchema, updateTaskSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const tasks = await prisma.task.findMany({
      where: { caseId: req.params.caseId, orgId: req.user.orgId },
      include: {
        assignedTo: { select: { fullName: true } },
        createdBy: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ data: tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...data,
        caseId: req.params.caseId,
        orgId: req.user.orgId,
        createdById: req.user.userId,
      },
    });

    res.locals.entityId = task.id;
    res.locals.auditDetail = { title: task.title };

    return res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateTaskSchema.parse(req.body);

    const task = await prisma.task.findFirst({
      where: { id: req.params.taskId, caseId: req.params.caseId, orgId: req.user.orgId },
    });

    if (!task) throw new NotFoundError('Task not found');

    const updated = await prisma.task.update({
      where: { id: task.id },
      data,
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { updatedKeys: Object.keys(data) };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const task = await prisma.task.findFirst({
      where: { id: req.params.taskId, caseId: req.params.caseId, orgId: req.user.orgId },
    });

    if (!task) throw new NotFoundError('Task not found');

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: {
        isComplete: true,
        completedAt: new Date(),
      },
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { title: task.title };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
