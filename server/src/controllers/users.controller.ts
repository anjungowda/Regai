import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { addHours } from 'date-fns';
import { prisma } from '../utils/prisma';
import { inviteUserSchema, updateUserSchema } from '../utils/validators';
import { UnauthorisedError, ConflictError, NotFoundError } from '../utils/errors';
import { sendEmail } from '../config/email';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const users = await prisma.user.findMany({
      where: { orgId: req.user.orgId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = inviteUserSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    // Set a random impossible password. They must reset via the token.
    const tempPasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);

    const user = await prisma.user.create({
      data: {
        ...data,
        orgId: req.user.orgId,
        passwordHash: tempPasswordHash,
        isActive: false, // Inactive until they accept
      },
    });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 10);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: addHours(new Date(), 48), // 48-hour invite window
      },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&invite=true`;
    
    sendEmail({
      to: user.email,
      subject: "You've been invited to RegShield AI",
      htmlBody: `You have been added to RegShield AI. Click <a href="${inviteLink}">here</a> to set your password and activate your account. Link expires in 48 hours.`,
    });

    res.locals.entityId = user.id;
    res.locals.auditDetail = { email: user.email, role: user.role };

    return res.status(201).json({ message: 'User invited successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const user = await prisma.user.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: { casesAssigned: true, casesCompleted: false } // Only fields explicitly defined in schema count
        }
      },
    });

    if (!user) throw new NotFoundError('User not found');

    // Also get cases closed manually 
    const casesClosed = await prisma.case.count({
      where: { decisionBy: user.id, orgId: req.user.orgId, status: 'closed' }
    });

    return res.json({ data: { ...user, casesClosed } });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateUserSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
    });

    if (!user) throw new NotFoundError('User not found');

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, email: true, fullName: true, role: true, isActive: true },
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { updatedKeys: Object.keys(data) };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
