// src/data/store.ts
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, Record } from '../models';

// ── In-memory "database" ──────────────────────────────────────────────────────
export const db = {
  users: [] as User[],
  records: [] as Record[],
};

// ── Seed Users ─────────────────────────────────────────────────────────────────
const seedUsers = async () => {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  db.users = [
    {
      id: uuidv4(),
      userId: 'admin01',
      passwordHash: hash('Admin@123'),
      role: 'Admin',
      fullName: 'Alexandra Reeves',
      email: 'areeves@nexus.io',
      department: 'Platform Engineering',
      createdAt: new Date('2024-01-10').toISOString(),
      lastLogin: new Date('2025-05-24T09:15:00').toISOString(),
      isActive: true,
    },
    {
      id: uuidv4(),
      userId: 'jsmith',
      passwordHash: hash('User@123'),
      role: 'General User',
      fullName: 'James Smith',
      email: 'jsmith@nexus.io',
      department: 'Analytics',
      createdAt: new Date('2024-02-14').toISOString(),
      lastLogin: new Date('2025-05-23T14:30:00').toISOString(),
      isActive: true,
    },
    {
      id: uuidv4(),
      userId: 'mchen',
      passwordHash: hash('User@123'),
      role: 'General User',
      fullName: 'Michelle Chen',
      email: 'mchen@nexus.io',
      department: 'Operations',
      createdAt: new Date('2024-03-01').toISOString(),
      lastLogin: new Date('2025-05-22T11:00:00').toISOString(),
      isActive: true,
    },
    {
      id: uuidv4(),
      userId: 'rbrown',
      passwordHash: hash('User@123'),
      role: 'General User',
      fullName: 'Robert Brown',
      email: 'rbrown@nexus.io',
      department: 'Finance',
      createdAt: new Date('2024-04-05').toISOString(),
      isActive: false,
    },
  ];
};

// ── Seed Records ───────────────────────────────────────────────────────────────
const seedRecords = () => {
  const generalUserId = db.users.find(u => u.userId === 'jsmith')!.id;
  const adminId = db.users.find(u => u.userId === 'admin01')!.id;
  const mchenId = db.users.find(u => u.userId === 'mchen')!.id;

  db.records = [
    {
      id: uuidv4(), title: 'Q2 Revenue Forecast', description: 'Quarterly revenue projections for all business units.',
      status: 'Active', priority: 'High', category: 'Finance',
      ownerId: generalUserId, ownerName: 'James Smith',
      createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-05-10T14:00:00Z',
      accessLevel: 'Restricted', tags: ['finance', 'forecast', 'Q2'], value: 4200000,
    },
    {
      id: uuidv4(), title: 'Platform Migration Plan', description: 'Migration strategy for legacy infrastructure to cloud-native architecture.',
      status: 'Pending', priority: 'Critical', category: 'Engineering',
      ownerId: adminId, ownerName: 'Alexandra Reeves',
      createdAt: '2025-03-15T10:00:00Z', updatedAt: '2025-05-20T09:30:00Z',
      accessLevel: 'Confidential', tags: ['cloud', 'migration', 'infrastructure'], value: 850000,
    },
    {
      id: uuidv4(), title: 'Customer Onboarding Workflow', description: 'Standardized workflow for new enterprise client onboarding.',
      status: 'Active', priority: 'Medium', category: 'Operations',
      ownerId: mchenId, ownerName: 'Michelle Chen',
      createdAt: '2025-02-20T11:00:00Z', updatedAt: '2025-05-15T16:00:00Z',
      accessLevel: 'Public', tags: ['onboarding', 'workflow', 'customers'], value: 120000,
    },
    {
      id: uuidv4(), title: 'Security Audit Report 2025', description: 'Annual security posture assessment and vulnerability remediation plan.',
      status: 'Closed', priority: 'Critical', category: 'Security',
      ownerId: adminId, ownerName: 'Alexandra Reeves',
      createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-04-30T17:00:00Z',
      accessLevel: 'Confidential', tags: ['security', 'audit', 'compliance'],
    },
    {
      id: uuidv4(), title: 'Employee Engagement Survey', description: 'Bi-annual survey results and action items from HR.',
      status: 'Active', priority: 'Low', category: 'HR',
      ownerId: generalUserId, ownerName: 'James Smith',
      createdAt: '2025-05-01T08:00:00Z', updatedAt: '2025-05-18T12:00:00Z',
      accessLevel: 'Public', tags: ['hr', 'survey', 'engagement'],
    },
    {
      id: uuidv4(), title: 'API Gateway Throughput Analysis', description: 'Performance benchmarks for API gateway under peak load conditions.',
      status: 'Active', priority: 'High', category: 'Engineering',
      ownerId: adminId, ownerName: 'Alexandra Reeves',
      createdAt: '2025-05-05T10:00:00Z', updatedAt: '2025-05-25T08:00:00Z',
      accessLevel: 'Restricted', tags: ['api', 'performance', 'analysis'], value: 55000,
    },
    {
      id: uuidv4(), title: 'Vendor Contract Renewals', description: 'List of vendor contracts due for renewal in H2 2025.',
      status: 'Pending', priority: 'Medium', category: 'Procurement',
      ownerId: mchenId, ownerName: 'Michelle Chen',
      createdAt: '2025-04-10T13:00:00Z', updatedAt: '2025-05-12T11:00:00Z',
      accessLevel: 'Restricted', tags: ['vendor', 'procurement', 'contracts'], value: 320000,
    },
    {
      id: uuidv4(), title: 'Product Roadmap H2 2025', description: 'Strategic product initiatives planned for the second half of 2025.',
      status: 'Active', priority: 'High', category: 'Product',
      ownerId: adminId, ownerName: 'Alexandra Reeves',
      createdAt: '2025-05-01T09:00:00Z', updatedAt: '2025-05-22T15:00:00Z',
      accessLevel: 'Confidential', tags: ['roadmap', 'product', 'strategy'], value: 1500000,
    },
    {
      id: uuidv4(), title: 'Support Ticket Backlog', description: 'Current open support tickets requiring resolution.',
      status: 'Pending', priority: 'Medium', category: 'Support',
      ownerId: generalUserId, ownerName: 'James Smith',
      createdAt: '2025-05-20T07:00:00Z', updatedAt: '2025-05-26T06:00:00Z',
      accessLevel: 'Public', tags: ['support', 'tickets'],
    },
    {
      id: uuidv4(), title: 'Data Compliance Checklist', description: 'GDPR and SOC2 compliance verification checklist for 2025.',
      status: 'Archived', priority: 'Critical', category: 'Compliance',
      ownerId: adminId, ownerName: 'Alexandra Reeves',
      createdAt: '2024-12-01T09:00:00Z', updatedAt: '2025-03-01T10:00:00Z',
      accessLevel: 'Confidential', tags: ['gdpr', 'compliance', 'soc2'],
    },
  ];
};

export const initializeDb = async () => {
  await seedUsers();
  seedRecords();
  console.log(`✅  DB seeded: ${db.users.length} users, ${db.records.length} records`);
};