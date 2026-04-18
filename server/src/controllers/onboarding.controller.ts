import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { onboardingSchema } from '../utils/validators';
import { UnauthorisedError } from '../utils/errors';

export const completeOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = onboardingSchema.parse(req.body);

    const [organisation, user] = await prisma.$transaction([
      prisma.organisation.update({
        where: { id: req.user.orgId },
        data: {
          displayName: data.displayName,
          orgType: data.orgType,
          regulatoryFramework: data.regulatoryFramework,
          complianceTeamSize: data.complianceTeamSize,
        },
      }),
      prisma.user.update({
        where: { id: req.user.userId },
        data: { onboardingComplete: true },
      }),
    ]);

    const { passwordHash: _, ...safeUser } = user;

    res.locals.auditDetail = { update: 'Onboarding completed' };
    res.locals.entityId = req.user.orgId;

    return res.json({
      data: { organisation, user: safeUser },
    });
  } catch (error) {
    next(error);
  }
};
