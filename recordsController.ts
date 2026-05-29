// src/controllers/recordsController.ts
import { Response } from 'express';
import { db } from '../data/store';
import { AuthRequest } from '../middleware/auth';

export const getRecords = (req: AuthRequest, res: Response): void => {
  const start = Date.now();
  const { status, priority, category, accessLevel } = req.query;

  let records = [...db.records];

  // General users only see Public + Restricted; Admins see all
  if (req.userRole !== 'Admin') {
    records = records.filter(r => r.accessLevel !== 'Confidential');
  }

  // Filters
  if (status) records = records.filter(r => r.status === status);
  if (priority) records = records.filter(r => r.priority === priority);
  if (category) records = records.filter(r => r.category === category);
  if (accessLevel && req.userRole === 'Admin') records = records.filter(r => r.accessLevel === accessLevel);

  res.json({
    success: true,
    data: records,
    message: `${records.length} record(s) returned for role: ${req.userRole}`,
    timestamp: new Date().toISOString(),
    processingTimeMs: Date.now() - start,
    meta: {
      total: records.length,
      role: req.userRole,
      accessNote: req.userRole === 'Admin'
        ? 'Full access: all records including Confidential'
        : 'Restricted access: Public and Restricted records only',
    },
  });
};

export const getRecordById = (req: AuthRequest, res: Response): void => {
  const record = db.records.find(r => r.id === req.params['id']);
  if (!record) {
    res.status(404).json({ success: false, error: 'Record not found', timestamp: new Date().toISOString() });
    return;
  }
  if (req.userRole !== 'Admin' && record.accessLevel === 'Confidential') {
    res.status(403).json({ success: false, error: 'Access denied: Confidential record', timestamp: new Date().toISOString() });
    return;
  }
  res.json({ success: true, data: record, timestamp: new Date().toISOString() });
};

export const getStats = (req: AuthRequest, res: Response): void => {
  const records = req.userRole === 'Admin'
    ? db.records
    : db.records.filter(r => r.accessLevel !== 'Confidential');

  const stats = {
    total: records.length,
    byStatus: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byAccessLevel: {} as Record<string, number>,
    totalValue: records.reduce((sum, r) => sum + (r.value || 0), 0),
  };

  records.forEach(r => {
    stats.byStatus[r.status] = (stats.byStatus[r.status] || 0) + 1;
    stats.byPriority[r.priority] = (stats.byPriority[r.priority] || 0) + 1;
    stats.byCategory[r.category] = (stats.byCategory[r.category] || 0) + 1;
    stats.byAccessLevel[r.accessLevel] = (stats.byAccessLevel[r.accessLevel] || 0) + 1;
  });

  res.json({ success: true, data: stats, timestamp: new Date().toISOString() });
};