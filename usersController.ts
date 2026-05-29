// src/controllers/usersController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../data/store';
import { CreateUserRequest } from '../models';
import { AuthRequest } from '../middleware/auth';

export const getAllUsers = (_req: Request, res: Response): void => {
  const users = db.users.map(({ passwordHash, ...u }) => u);
  res.json({ success: true, data: users, timestamp: new Date().toISOString() });
};

export const getUserById = (req: Request, res: Response): void => {
  const user = db.users.find(u => u.id === req.params['id']);
  if (!user) { res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() }); return; }
  const { passwordHash, ...safe } = user;
  res.json({ success: true, data: safe, timestamp: new Date().toISOString() });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, password, role, fullName, email, department } = req.body as CreateUserRequest;

  if (!userId || !password || !role || !fullName || !email) {
    res.status(400).json({ success: false, error: 'All fields required', timestamp: new Date().toISOString() }); return;
  }
  if (db.users.find(u => u.userId === userId)) {
    res.status(409).json({ success: false, error: 'User ID already exists', timestamp: new Date().toISOString() }); return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(), userId, passwordHash, role, fullName, email,
    department: department || 'General', createdAt: new Date().toISOString(), isActive: true,
  };
  db.users.push(newUser);

  const { passwordHash: _, ...safe } = newUser;
  res.status(201).json({ success: true, data: safe, message: 'User created successfully', timestamp: new Date().toISOString() });
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = db.users.find(u => u.id === req.params['id']);
  if (!user) { res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() }); return; }

  const { fullName, email, department, role, isActive, password } = req.body;
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (department) user.department = department;
  if (role) user.role = role;
  if (typeof isActive === 'boolean') user.isActive = isActive;
  if (password) user.passwordHash = await bcrypt.hash(password, 10);

  const { passwordHash, ...safe } = user;
  res.json({ success: true, data: safe, message: 'User updated', timestamp: new Date().toISOString() });
};

export const deleteUser = (req: AuthRequest, res: Response): void => {
  const idx = db.users.findIndex(u => u.id === req.params['id']);
  if (idx === -1) { res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() }); return; }

  // Prevent admin from deleting themselves
  const user = db.users[idx];
  if (user.id === req.userDbId) {
    res.status(400).json({ success: false, error: 'Cannot delete your own account', timestamp: new Date().toISOString() }); return;
  }
  db.users.splice(idx, 1);
  res.json({ success: true, message: 'User deleted', timestamp: new Date().toISOString() });
};