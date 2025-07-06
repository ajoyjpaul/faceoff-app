import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers['user-agent'] || 'unknown';
  const contentType = req.headers['content-type'] || 'none';
  
  // Extract just the browser type (privacy-safe)
  const browser = getBrowserType(userAgent);
  
  console.log(`${timestamp} - ${method} ${url} - ${browser} - ${contentType}`);
  
  next();
};

// Helper function to extract browser type without detailed version info
function getBrowserType(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Postman')) return 'Postman';
  if (userAgent.includes('curl')) return 'curl';
  if (userAgent.includes('axios')) return 'axios';
  return 'other';
}