import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import onboardingRoutes from './routes/onboarding.routes';
import casesRoutes from './routes/cases.routes';
import notesRoutes from './routes/notes.routes';
import evidenceRoutes from './routes/evidence.routes';
import evidenceGlobalRoutes from './routes/evidence-global.routes';
import tasksRoutes from './routes/tasks.routes';
import alertsRoutes from './routes/alerts.routes';
import riskAssessmentsRoutes from './routes/riskAssessments.routes';
import flagsRoutes from './routes/flags.routes';
import templatesRoutes from './routes/templates.routes';
import customersRoutes from './routes/customers.routes';
import companiesRoutes from './routes/companies.routes';
import usersRoutes from './routes/users.routes';
import auditLogRoutes from './routes/auditLog.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notificationsRoutes from './routes/notifications.routes';
import publicRoutes from './routes/public.routes';
import billingRoutes from './routes/billing.routes';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

// Webhook for Stripe must be handled before global JSON parsing
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }), billingRoutes);

// Normal request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Core Entities
app.use('/api/cases', casesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/users', usersRoutes);

// Attach Nested Routes to Cases (via explicit mounting since we didn't use pure nesting in app.use)
app.use('/api/cases/:caseId/notes', notesRoutes);
app.use('/api/cases/:caseId/evidence', evidenceRoutes);
app.use('/api/cases/:caseId/tasks', tasksRoutes);

// Independent Modules
app.use('/api/evidence', evidenceGlobalRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/risk-assessments', riskAssessmentsRoutes);
app.use('/api/flags', flagsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/audit-log', auditLogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/billing', billingRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
  });
}

export default app;
