// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../data/store';
import { LoginRequest, ApiResponse, LoginResponse } from '../models';
import { JWT_SECRET } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  const start = Date.now();
  const { userId, password, role } = req.body as LoginRequest;

  if (!userId || !password || !role) {
    res.status(400).json({
      success: false, error: 'userId, password, and role are required',
      timestamp: new Date().toISOString(), processingTimeMs: Date.now() - start,
    } as ApiResponse<null>);
    return;
  }

  const user = db.users.find(u => u.userId === userId && u.role === role);
  if (!user) {
    res.status(401).json({
      success: false, error: 'Invalid credentials or role mismatch',
      timestamp: new Date().toISOString(), processingTimeMs: Date.now() - start,
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      success: false, error: 'Account is deactivated. Contact administrator.',
      timestamp: new Date().toISOString(), processingTimeMs: Date.now() - start,
    });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({
      success: false, error: 'Invalid credentials',
      timestamp: new Date().toISOString(), processingTimeMs: Date.now() - start,
    });
    return;
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  const expiresIn = 3600;
  const token = jwt.sign({ userId: user.userId, role: user.role, dbId: user.id }, JWT_SECRET, { expiresIn });

  const { passwordHash, ...safeUser } = user;
  res.json({
    success: true,
    data: { token, user: safeUser, expiresIn } as LoginResponse,
    message: `Welcome back, ${user.fullName}!`,
    timestamp: new Date().toISOString(),
    processingTimeMs: Date.now() - start,
  } as ApiResponse<LoginResponse>);
};

export const getProfile = (req: Request & { userDbId?: string }, res: Response): void => {
  const start = Date.now();
  const user = db.users.find(u => u.id === req.userDbId);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() });
    return;
  }
  const { passwordHash, ...safeUser } = user;
  res.json({
    success: true, data: safeUser,
    timestamp: new Date().toISOString(), processingTimeMs: Date.now() - start,
  });
};