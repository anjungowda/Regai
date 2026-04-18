import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { publicContactSchema, publicDemoSchema } from '../utils/validators';
import { sendEmail } from '../config/email';
import { logger } from '../utils/logger';

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = publicContactSchema.parse(req.body);

    const submission = await prisma.contactSubmission.create({
      data,
    });

    // Notify Admin asynchronously
    sendEmail({
      to: process.env.SES_ADMIN_EMAIL || 'info@regshield.ai',
      subject: `New Contact Submission from ${data.companyName}`,
      htmlBody: `
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `,
    }).catch(err => logger.error('Failed to send contact notification email', err));

    return res.status(201).json({ message: 'Submission successful', id: submission.id });
  } catch (error) {
    next(error);
  }
};

export const submitDemo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = publicDemoSchema.parse(req.body);

    const submission = await prisma.demoRequest.create({
      data,
    });

    // Notify Admin asynchronously
    sendEmail({
      to: process.env.SES_ADMIN_EMAIL || 'info@regshield.ai',
      subject: `New Demo Request from ${data.companyName}`,
      htmlBody: `
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Team Size:</strong> ${data.teamSize}</p>
        <p><strong>Date:</strong> ${data.preferredDate}</p>
        <p><strong>Time:</strong> ${data.preferredTimeSlot}</p>
        <p><strong>Challenge:</strong> ${data.biggestChallenge}</p>
      `,
    }).catch(err => logger.error('Failed to send demo notification email', err));

    return res.status(201).json({ message: 'Demo request successful', id: submission.id });
  } catch (error) {
    next(error);
  }
};
