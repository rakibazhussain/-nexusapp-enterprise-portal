// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../data/store';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-super-secret-key-2025';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userDbId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No token provided', timestamp: new Date().toISOString() });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string; dbId: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userDbId = decoded.dbId;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token', timestamp: new Date().toISOString() });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'Admin') {
    res.status(403).json({ success: false, error: 'Admin access required', timestamp: new Date().toISOString() });
    return;
  }
  next();
};

export const delay = (req: Request, res: Response, next: NextFunction): void => {
  const ms = parseInt(req.query['delay'] as string) || 0;
  const clamped = Math.min(ms, 10000); // max 10 seconds
  if (clamped > 0) {
    setTimeout(next, clamped);
  } else {
    next();
  }
};

export { JWT_SECRET };