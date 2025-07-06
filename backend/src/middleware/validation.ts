import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/helpers';
import { ValidationSchema } from '../types';

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const errors: string[] = [];

    // Validate email format (email validation also checks if it exists)
    if (schema.email) {
      if (!body.email || (typeof body.email === 'string' && body.email.trim() === '')) {
        errors.push('Email is required');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
          errors.push('Invalid email format');
        }
      }
    }

    // Validate password exists (no strength validation for signin)
    if (schema.password) {
      if (!body.password || (typeof body.password === 'string' && body.password.trim() === '')) {
        errors.push('Password is required');
      }
    }

    if (errors.length > 0) {
      return sendResponse.error(res, 'Validation failed', 400, errors);
    }

    next();
  };
};