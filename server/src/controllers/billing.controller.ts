import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { UnauthorisedError, NotFoundError } from '../utils/errors';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const org = await prisma.organisation.findUnique({
      where: { id: req.user.orgId },
    });

    if (!org) throw new NotFoundError('Organisation not found');

    let customerId = org.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: org.billingEmail || req.user.email,
        name: org.name,
        metadata: { orgId: org.id },
      });
      customerId = customer.id;
      
      await prisma.organisation.update({
        where: { id: org.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = req.body.planName === 'professional' 
      ? process.env.STRIPE_PRICE_PRO 
      : process.env.STRIPE_PRICE_STANDARD;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing?canceled=true`,
    });

    return res.json({ data: { url: session.url } });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // req.body must be raw buffer here, so we need special parsing in app.ts usually
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret as string);
  } catch (err: any) {
    logger.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const org = await prisma.organisation.findUnique({ where: { stripeCustomerId: customerId } });
      
      if (org) {
        await prisma.subscription.update({
          where: { orgId: org.id },
          data: {
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).end();
  }
};

export const getBillingPortal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const org = await prisma.organisation.findUnique({ where: { id: req.user.orgId } });
    if (!org || !org.stripeCustomerId) {
      throw new NotFoundError('No billing setup found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing`,
    });

    return res.json({ data: { url: session.url } });
  } catch (error) {
    next(error);
  }
};
