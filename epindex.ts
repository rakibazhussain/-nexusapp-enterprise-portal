// src/index.ts
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDb } from './data/store';

const app = express();
const PORT = process.env['PORT'] || 3000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  const delay = req.query['delay'];
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}${delay ? ` (delay: ${delay}ms)` : ''}`);
  next();
});

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

initializeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  NexusApp API running on http://localhost:${PORT}`);
    console.log(`\n📋  Test Credentials:`);
    console.log(`   Admin  → userId: admin01  | password: Admin@123  | role: Admin`);
    console.log(`   User   → userId: jsmith   | password: User@123   | role: General User`);
    console.log(`\n💡  Add ?delay=2000 to any request to simulate async delay\n`);
  });
});