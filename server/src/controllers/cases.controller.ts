import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createCaseSchema, updateCaseSchema, closeCaseSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError, ConflictError } from '../utils/errors';
import { sendEmail } from '../config/email';

export const getCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const { status, riskLevel, caseType, assignedToId, page = '1', limit = '20' } = req.query;
    
    // Explicitly scope query to orgId
    const whereClause: any = { orgId: req.user.orgId };

    if (status) whereClause.status = status as string;
    if (riskLevel) whereClause.riskLevel = riskLevel as string;
    if (caseType) whereClause.caseType = caseType as string;
    if (assignedToId) whereClause.assignedToId = assignedToId as string;

    const skip = (Number(page) - 1) * Number(limit);

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where: whereClause,
        include: { assignedTo: { select: { fullName: true, email: true } } },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.case.count({ where: whereClause })
    ]);

    return res.json({
      data: {
        cases,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createCaseSchema.parse(req.body);

    const year = new Date().getFullYear();
    const count = await prisma.case.count({ where: { orgId: req.user.orgId } });
    const sequence = String(count + 1).padStart(4, '0');
    const caseRef = `RS-${year}-${sequence}`;

    const newCase = await prisma.case.create({
      data: {
        ...data,
        caseRef,
        orgId: req.user.orgId,
        createdById: req.user.userId,
      },
      include: { assignedTo: true }
    });

    if (newCase.assignedTo) {
      sendEmail({
        to: newCase.assignedTo.email,
        subject: `New Case Assigned: ${caseRef}`,
        htmlBody: `<p>You have been assigned to case ${caseRef}.</p>`
      });
    }

    res.locals.entityId = newCase.id;
    res.locals.auditDetail = { caseRef, caseType: newCase.caseType };

    return res.status(201).json({ data: newCase });
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const caseItem = await prisma.case.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
      include: {
        assignedTo: { select: { id: true, fullName: true, email: true } },
        reviewer: { select: { id: true, fullName: true, email: true } },
        customer: true,
        company: true,
        _count: {
          select: { notes: true, evidence: true, tasks: true, alerts: true }
        }
      }
    });

    if (!caseItem) throw new NotFoundError('Case not found');

    return res.json({ data: caseItem });
  } catch (error) {
    next(error);
  }
};

export const updateCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateCaseSchema.parse(req.body);

    const existingCase = await prisma.case.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId }
    });

    if (!existingCase) throw new NotFoundError('Case not found');

    const updatedCase = await prisma.case.update({
      where: { id: req.params.id },
      data
    });

    // Compute diff for audit log
    const diff: any = {};
    for (const key of Object.keys(data)) {
      if ((existingCase as any)[key] !== (updatedCase as any)[key]) {
        diff[key] = { from: (existingCase as any)[key], to: (updatedCase as any)[key] };
      }
    }

    res.locals.entityId = updatedCase.id;
    res.locals.auditDetail = diff;

    return res.json({ data: updatedCase });
  } catch (error) {
    next(error);
  }
};

export const closeCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = closeCaseSchema.parse(req.body);

    const existingCase = await prisma.case.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId } // Ensure orgId scope
    });

    if (!existingCase) throw new NotFoundError('Case not found');
    if (existingCase.status !== 'pending_review') {
      throw new ConflictError("Case must be in 'pending_review' status before closure");
    }

    const updatedCase = await prisma.case.update({
      where: { id: req.params.id },
      data: {
        ...data,
        status: 'closed',
        closedAt: new Date(),
        decisionBy: req.user.userId,
        decisionAt: new Date()
      }
    });

    // Handle nextReviewDate if customer is attached
    if (existingCase.customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: existingCase.customerId } });
      if (customer && customer.reviewFrequency) {
        let monthsToAdd = 0;
        if (customer.reviewFrequency === 'monthly') monthsToAdd = 1;
        if (customer.reviewFrequency === 'quarterly') monthsToAdd = 3;
        if (customer.reviewFrequency === 'annually') monthsToAdd = 12;
        if (customer.reviewFrequency === 'every_3_years') monthsToAdd = 36;
        
        if (monthsToAdd > 0) {
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
          
          await prisma.customer.update({
            where: { id: customer.id },
            data: { lastReviewDate: new Date(), nextReviewDate: nextDate }
          });
        }
      }
    }

    res.locals.entityId = updatedCase.id;
    res.locals.auditDetail = { outcome: data.decisionOutcome };

    return res.json({ data: updatedCase });
  } catch (error) {
    next(error);
  }
};
