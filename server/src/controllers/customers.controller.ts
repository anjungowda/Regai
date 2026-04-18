import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createCustomerSchema, updateCustomerSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const { search, riskRating, page = '1', limit = '20' } = req.query;
    const whereClause: any = { orgId: req.user.orgId };

    if (search) {
      whereClause.fullName = { contains: search as string, mode: 'insensitive' };
    }
    if (riskRating) {
      whereClause.riskRating = riskRating as string;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where: whereClause })
    ]);

    return res.json({
      data: {
        customers,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createCustomerSchema.parse(req.body);

    const customer = await prisma.customer.create({
      data: {
        ...data,
        orgId: req.user.orgId
      }
    });

    res.locals.entityId = customer.id;
    res.locals.auditDetail = { name: customer.fullName };

    return res.status(201).json({ data: customer });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
      include: {
        _count: { select: { cases: true } },
        flags: { where: { status: 'open' } },
        riskAssessments: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    if (!customer) throw new NotFoundError('Customer not found');

    return res.json({ data: customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateCustomerSchema.parse(req.body);

    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId }
    });

    if (!existing) throw new NotFoundError('Customer not found');

    const updated = await prisma.customer.update({
      where: { id: req.params.id },
      data
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { updatedKeys: Object.keys(data) };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const getCustomerCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const cases = await prisma.case.findMany({
      where: { customerId: req.params.id, orgId: req.user.orgId },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ data: cases });
  } catch (error) {
    next(error);
  }
};
