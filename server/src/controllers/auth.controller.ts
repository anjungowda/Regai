import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { addDays, addHours, addMinutes, isFuture } from 'date-fns';
import { prisma } from '../utils/prisma';
import { UnauthorisedError, ConflictError } from '../utils/errors';
import { sendEmail } from '../config/email';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '../utils/validators';

const generateTokens = (userId: string, orgId: string, role: string, email: string) => {
  const secret = process.env.JWT_SECRET as string;
  const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

  const accessToken = jwt.sign({ userId, orgId, role, email }, secret, { expiresIn: '8h' });
  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN || 'localhost';

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain,
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictError('A user with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organisation.create({
        data: {
          name: data.orgName,
          planType: data.planType,
          billingEmail: data.email,
        },
      });

      const user = await tx.user.create({
        data: {
          orgId: org.id,
          email: data.email,
          passwordHash,
          fullName: data.fullName,
          role: 'admin',
        },
      });

      await tx.subscription.create({
        data: {
          orgId: org.id,
          planName: data.planType,
          status: 'trialing',
          trialEndsAt: addDays(new Date(), 14),
        },
      });

      return { org, user };
    });

    const { accessToken, refreshToken } = generateTokens(
      result.user.id,
      result.org.id,
      result.user.role,
      result.user.email
    );

    // Hash refresh token for DB storage
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId: result.user.id,
        token: tokenHash,
        expiresAt: addDays(new Date(), 7),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

    // Async welcome email
    sendEmail({
      to: result.user.email,
      subject: 'Welcome to RegShield AI',
      htmlBody: `<h1>Welcome to RegShield AI, ${result.user.fullName}!</h1><p>Your 14-day trial for ${result.org.name} has started.</p>`,
    });

    res.locals.auditDetail = { orgName: result.org.name, email: result.user.email };
    res.locals.entityId = result.user.id;
    
    // Attach minimal mock user to req so auditLogger hook can extract orgId for the first action
    req.user = { userId: result.user.id, orgId: result.org.id, role: result.user.role, email: result.user.email };

    // Strip passwordHash before sending
    const { passwordHash: _, ...safeUser } = result.user;

    return res.status(201).json({
      data: { user: safeUser, organisation: result.org },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { org: true },
    });

    if (!user) {
      throw new UnauthorisedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorisedError('Your account has been deactivated.');
    }

    if (user.lockedUntil && isFuture(user.lockedUntil)) {
      throw new UnauthorisedError(`Account locked. Try again after ${user.lockedUntil.toISOString()} or reset your password.`);
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!isMatch) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil = attempts >= 5 ? addMinutes(new Date(), 15) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockedUntil },
      });

      if (lockedUntil) {
        throw new UnauthorisedError('Account locked due to too many failed attempts.');
      }
      throw new UnauthorisedError('Invalid credentials');
    }

    // Reset login attempts
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLogin: new Date() },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.org.id, user.role, user.email);

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt: addDays(new Date(), 7),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

    req.user = { userId: user.id, orgId: user.org.id, role: user.role, email: user.email };
    res.locals.auditDetail = { ip: req.ip };

    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      data: { user: safeUser, organisation: user.org },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken && req.user) {
      const dbTokens = await prisma.refreshToken.findMany({
        where: { userId: req.user.userId, isRevoked: false },
      });

      for (const t of dbTokens) {
        const isMatch = await bcrypt.compare(refreshToken, t.token);
        if (isMatch) {
          await prisma.refreshToken.update({
            where: { id: t.id },
            data: { isRevoked: true },
          });
          break;
        }
      }
    }

    res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN || 'localhost', path: '/' });
    res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN || 'localhost', path: '/' });

    res.locals.auditDetail = { ip: req.ip };

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) throw new UnauthorisedError();

    const secret = process.env.JWT_REFRESH_SECRET as string;
    const decoded = jwt.verify(token, secret) as { userId: string };

    const dbTokens = await prisma.refreshToken.findMany({
      where: { userId: decoded.userId, isRevoked: false },
    });

    let matchedTokenId: string | null = null;
    for (const t of dbTokens) {
      if (isFuture(t.expiresAt) && await bcrypt.compare(token, t.token)) {
        matchedTokenId = t.id;
        break;
      }
    }

    if (!matchedTokenId) throw new UnauthorisedError('Invalid or expired refresh token');

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) throw new UnauthorisedError();

    const { accessToken } = generateTokens(user.id, user.orgId, user.role, user.email);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN || 'localhost',
      maxAge: 8 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ data: { user: safeUser } });
  } catch (error) {
    next(new UnauthorisedError('Authentication failed'));
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = await bcrypt.hash(resetToken, 10);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: addHours(new Date(), 1),
        },
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        htmlBody: `Click <a href="${resetLink}">here</a> to reset your password. It expires in 1 hour.`,
      });
    }

    // Always return generic success for security
    return res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    // Look for valid tokens efficiently by parsing recent ones (not highly scaleable but secure)
    const recentTokens = await prisma.passwordResetToken.findMany({
      where: { isUsed: false, expiresAt: { gt: new Date() } },
    });

    let validTokenRecord = null;
    for (const t of recentTokens) {
      if (await bcrypt.compare(data.token, t.tokenHash)) {
        validTokenRecord = t;
        break;
      }
    }

    if (!validTokenRecord) {
      throw new UnauthorisedError('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: validTokenRecord.userId },
        data: { passwordHash, lockedUntil: null, failedLoginAttempts: 0 },
      }),
      prisma.passwordResetToken.update({
        where: { id: validTokenRecord.id },
        data: { isUsed: true },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: validTokenRecord.userId },
        data: { isRevoked: true },
      }),
    ]);

    return res.json({ message: 'Password updated successfully. Please log in.' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { org: true },
    });

    if (!user) throw new UnauthorisedError();

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ data: { user: safeUser, organisation: user.org } });
  } catch (error) {
    next(error);
  }
};
