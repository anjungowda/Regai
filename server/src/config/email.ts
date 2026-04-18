import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logger } from '../utils/logger';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export const sendEmail = async ({ to, subject, htmlBody, textBody }: SendEmailParams): Promise<void> => {
  const fromEmail = process.env.SES_FROM_EMAIL || 'noreply@regshield.ai';

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
        ...(textBody && {
          Text: {
            Charset: 'UTF-8',
            Data: textBody,
          },
        }),
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: fromEmail,
  };

  try {
    const command = new SendEmailCommand(params);
    // Ignore execution failures in local dev without real creds
    if (process.env.AWS_ACCESS_KEY_ID) {
      await sesClient.send(command);
    } else {
      logger.info(`[LOCAL MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    }
  } catch (error) {
    logger.error('Failed to send email:', error);
    // We intentionally don't throw to prevent interrupting critical flows like registration.
  }
};
