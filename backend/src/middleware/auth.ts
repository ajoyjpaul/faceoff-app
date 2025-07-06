import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';
import * as admin from 'firebase-admin';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided. Access denied.', 401);
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      throw createError('Invalid token format. Access denied.', 401);
    }
    
    const decoded = await verifyFirebaseToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(error);
  }
};

// Firebase token verification
async function verifyFirebaseToken(token: string): Promise<{ uid: string }> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    return {
      uid: decodedToken.uid
    };
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    throw createError('Invalid or expired Firebase token', 401);
  }
}

export const rateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = requests.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      requests.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return next(createError('Too many requests. Please try again later.', 429));
    }
    
    clientData.count++;
    next();
  };
};