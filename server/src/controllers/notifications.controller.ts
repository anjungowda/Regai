import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId, orgId: req.user.orgId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.userId, orgId: req.user.orgId, isRead: false },
    });

    return res.json({ data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user.userId, orgId: req.user.orgId },
    });

    if (!notification) throw new NotFoundError('Notification not found');

    const updated = await prisma.notification.update({
      where: { id: notification.id },
      data: { isRead: true },
    });

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    await prisma.notification.updateMany({
      where: { userId: req.user.userId, orgId: req.user.orgId, isRead: false },
      data: { isRead: true },
    });

    return res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
