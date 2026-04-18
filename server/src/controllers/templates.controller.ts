import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createTemplateSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    // Return global templates (orgId = null) AND org-specific custom templates
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { orgId: null }, // Global templates
          { orgId: req.user.orgId } // Org custom templates
        ],
        isActive: true
      },
      orderBy: { templateName: 'asc' },
    });

    return res.json({ data: templates });
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createTemplateSchema.parse(req.body);

    const template = await prisma.template.create({
      data: {
        ...data,
        orgId: req.user.orgId,
        isCustom: true,
        createdById: req.user.userId,
      },
    });

    res.locals.entityId = template.id;
    res.locals.auditDetail = { name: template.templateName };

    return res.status(201).json({ data: template });
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const template = await prisma.template.findFirst({
      where: {
        id: req.params.id,
        OR: [{ orgId: null }, { orgId: req.user.orgId }],
      },
    });

    if (!template) throw new NotFoundError('Template not found');

    return res.json({ data: template });
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createTemplateSchema.partial().parse(req.body);

    const existing = await prisma.template.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId, isCustom: true }, // Cannot modify global templates
    });

    if (!existing) throw new NotFoundError('Custom template not found');

    const updated = await prisma.template.update({
      where: { id: existing.id },
      data,
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { updatedKeys: Object.keys(data) };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
