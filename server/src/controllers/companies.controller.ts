import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createCompanySchema, updateCompanySchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const { search, riskRating, page = '1', limit = '20' } = req.query;
    const whereClause: any = { orgId: req.user.orgId };

    if (search) {
      whereClause.companyName = { contains: search as string, mode: 'insensitive' };
    }
    if (riskRating) {
      whereClause.riskRating = riskRating as string;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.count({ where: whereClause }),
    ]);

    return res.json({
      data: {
        companies,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createCompanySchema.parse(req.body);

    const company = await prisma.company.create({
      data: {
        ...data,
        orgId: req.user.orgId,
      },
    });

    res.locals.entityId = company.id;
    res.locals.auditDetail = { name: company.companyName };

    return res.status(201).json({ data: company });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const company = await prisma.company.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
      include: {
        _count: { select: { cases: true } },
        flags: { where: { status: 'open' } },
        riskAssessments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!company) throw new NotFoundError('Company not found');

    return res.json({ data: company });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateCompanySchema.parse(req.body);

    const existing = await prisma.company.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
    });

    if (!existing) throw new NotFoundError('Company not found');

    const updated = await prisma.company.update({
      where: { id: req.params.id },
      data,
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { updatedKeys: Object.keys(data) };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
