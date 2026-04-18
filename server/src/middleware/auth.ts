import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorisedError } from '../utils/errors';
import { TokenPayload } from '../types';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token;
    
    if (!token) {
      throw new UnauthorisedError('Authentication required');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      req.user = decoded;
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorisedError('Session expired. Please log in again.');
      }
      throw new UnauthorisedError('Invalid authentication token');
    }
  } catch (error) {
    next(error);
  }
};
