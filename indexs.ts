// src/routes/index.ts
import { Router } from 'express';
import { login, getProfile } from '../controllers/authController';
import { getRecords, getRecordById, getStats } from '../controllers/recordsController';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/usersController';
import { authenticate, requireAdmin, delay } from '../middleware/auth';

const router = Router();

// ── Auth ───────────────────────────────────────────────────────────────────────
router.post('/auth/login', delay, login);
router.get('/auth/profile', authenticate, getProfile);

// ── Records (authenticated) ────────────────────────────────────────────────────
router.get('/records', authenticate, delay, getRecords);
router.get('/records/stats', authenticate, delay, getStats);
router.get('/records/:id', authenticate, getRecordById);

// ── Users (admin only) ─────────────────────────────────────────────────────────
router.get('/users', authenticate, requireAdmin, delay, getAllUsers);
router.get('/users/:id', authenticate, requireAdmin, getUserById);
router.post('/users', authenticate, requireAdmin, createUser);
router.put('/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

export default router;