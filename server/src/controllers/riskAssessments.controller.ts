import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createRiskAssessmentSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getRiskAssessments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const assessments = await prisma.riskAssessment.findMany({
      where: { orgId: req.user.orgId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return res.json({ data: assessments });
  } catch (error) {
    next(error);
  }
};

export const createRiskAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = createRiskAssessmentSchema.parse(req.body);

    const totalScore = 
      data.countryScore + data.occupationScore + data.sourceOfFundsScore + 
      data.pepScore + data.sanctionsScore + data.transactionVolumeScore + 
      data.relationshipDurationScore + data.adverseMediaScore;

    let riskClassification = 'low';
    let ddRecommendation = 'sdd';

    if (totalScore >= 76) {
      riskClassification = 'critical';
      ddRecommendation = 'edd_mlro';
    } else if (totalScore >= 51) {
      riskClassification = 'high';
      ddRecommendation = 'edd';
    } else if (totalScore >= 21) {
      riskClassification = 'medium';
      ddRecommendation = 'standard';
    }

    const assessment = await prisma.$transaction(async (tx) => {
      const result = await tx.riskAssessment.create({
        data: {
          ...data,
          orgId: req.user!.orgId,
          assessedById: req.user!.userId,
          totalScore,
          riskClassification,
          ddRecommendation,
        },
      });

      if (data.customerId) {
        await tx.customer.update({
          where: { id: data.customerId },
          data: { riskRating: riskClassification, riskScore: totalScore },
        });
      } else if (data.companyId) {
        await tx.company.update({
          where: { id: data.companyId },
          data: { riskRating: riskClassification, riskScore: totalScore },
        });
      }

      return result;
    });

    res.locals.entityId = assessment.id;
    res.locals.auditDetail = { totalScore, riskClassification };

    return res.status(201).json({ data: assessment });
  } catch (error) {
    next(error);
  }
};

export const getRiskAssessmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const assessment = await prisma.riskAssessment.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
      include: {
        assessedBy: { select: { fullName: true } },
      },
    });

    if (!assessment) throw new NotFoundError('Risk Assessment not found');

    return res.json({ data: assessment });
  } catch (error) {
    next(error);
  }
};
