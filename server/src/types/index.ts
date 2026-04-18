import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash'>;

export interface TokenPayload {
  userId: string;
  orgId: string;
  role: string;
  email: string;
}
