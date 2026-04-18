import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createNoteSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const caseItem = await prisma.case.findFirst({
      where: { id: req.params.caseId, orgId: req.user.orgId }
    });

    if (!caseItem) throw new NotFoundError('Case not found');

    const notes = await prisma.caseNote.findMany({
      where: { caseId: req.params.caseId },
      include: { author: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({ data: notes });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const caseItem = await prisma.case.findFirst({
      where: { id: req.params.caseId, orgId: req.user.orgId }
    });

    if (!caseItem) throw new NotFoundError('Case not found');

    const data = createNoteSchema.parse(req.body);

    const note = await prisma.caseNote.create({
      data: {
        ...data,
        caseId: req.params.caseId,
        authorId: req.user.userId
      }
    });

    res.locals.entityId = note.id;
    res.locals.auditDetail = { isInternal: note.isInternal };

    return res.status(201).json({ data: note });
  } catch (error) {
    next(error);
  }
};
