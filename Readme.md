# NexusApp — Enterprise Portal

A full-stack SPA built with **Angular-architecture TypeScript** frontend and a **Node.js + TypeScript** REST API backend. Submitted as part of the frontend/full-stack evaluation.

---

## 🚀 Live Demo Credentials

| Role | User ID | Password |
|------|---------|----------|
| Admin | `admin01` | `Admin@123` |
| General User | `jsmith` | `User@123` |

---

## 🏗️ Project Structure

```
nexusapp-enterprise-portal/
├── backend/                        # Node.js + TypeScript REST API
│   ├── src/
│   │   ├── index.ts                # Express app entry point
│   │   ├── models/index.ts         # TypeScript interfaces & types
│   │   ├── data/store.ts           # In-memory DB with seed data
│   │   ├── middleware/
│   │   │   └── auth.ts             # JWT auth + delay middleware
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Login, profile
│   │   │   ├── recordsController.ts# Records CRUD + stats
│   │   │   └── usersController.ts  # Admin user management
│   │   └── routes/index.ts         # All API routes
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   └── index.html                  # Angular-architecture SPA
│
└── README.md
```

---

## ⚙️ Features

### Authentication
- Login with **User ID, Password, and Role** selection
- JWT token-based session management
- Role validation on both frontend and backend
- Inactive account detection

### Role-Based Access Control
| Feature | General User | Admin |
|---------|-------------|-------|
| View Public records | ✅ | ✅ |
| View Restricted records | ✅ | ✅ |
| View Confidential records | ❌ | ✅ |
| Manage users (CRUD) | ❌ | ✅ |
| API delay control | ✅ | ✅ |

### Dashboard — Overview Tab
- Personalized greeting with live date
- Animated stats cards (total records, active, critical/high, access-level count)
- Full user profile display (name, email, department, last login, status)
- Access privileges panel (role-specific)

### Records Tab
- Tabular display of all accessible records
- Client-side search (title, category, tags)
- Filters: Status, Priority, Access Level
- Column sorting (ascending/descending)
- Color-coded badges for status, priority, access level

### Admin Tab (Admin only)
- Full user list with roles, departments, status, last login
- **Create User** — modal form with validation
- **Edit User** — pre-filled modal
- **Activate / Deactivate** user toggle
- **Delete** user with confirmation

### Async Processing Demo
- **API Delay Slider** in the topbar (0ms → 5000ms)
- Animated loading overlay with live elapsed timer
- Inline progress bar on page load
- Async indicators per section
- `Promise.all` parallel fetching (records + stats simultaneously)

---

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** — REST API framework
- **JWT (jsonwebtoken)** — stateless authentication
- **bcryptjs** — password hashing
- **In-memory store** — simulates MongoDB/DynamoDB (easily swappable)
- `?delay=ms` query parameter — simulates async API latency

### Frontend (Angular Architecture)
- **Vanilla TypeScript** compiled SPA mirroring Angular module patterns
- Modular service layer: `AuthService`, `RecordsService`, `UserService`, `HttpService`
- Component pattern: `LoginComponent`, `DashboardComponent`, `OverviewComponent`, `RecordsComponent`, `AdminComponent`
- Angular-style `Router` (view switching)
- `HttpClient`-style wrapper with interceptors (JWT injection)
- Google Fonts: Syne (display) + Inter (body) + DM Mono (code)
- CSS custom properties design system
- Responsive layout

---

## 🚦 API Endpoints

### Auth
```
POST   /api/auth/login       — Login with userId, password, role
GET    /api/auth/profile      — Get logged-in user profile (JWT required)
```

### Records
```
GET    /api/records           — Get all accessible records (role-filtered)
GET    /api/records/stats     — Get aggregated stats
GET    /api/records/:id       — Get single record
```
> All support `?delay=<ms>` for async simulation

### Users (Admin only)
```
GET    /api/users             — List all users
GET    /api/users/:id         — Get user by ID
POST   /api/users             — Create user
PUT    /api/users/:id         — Update user
DELETE /api/users/:id         — Delete user
```

---

## 🏃 How to Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
# API running at http://localhost:3000
```

### Frontend
```bash
# Simply open in browser:
cd frontend
open index.html
# Or use Live Server in VS Code
```

### Test the API directly
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"admin01","password":"Admin@123","role":"Admin"}'

# Get records with 2s simulated delay
curl http://localhost:3000/api/records?delay=2000 \
  -H "Authorization: Bearer <token>"
```

---

## 🎨 Design Decisions

- **Dark theme** with a teal (`#0df2a8`) accent — professional, modern enterprise aesthetic
- **Syne** display font for headings — distinctive, geometric character
- **DM Mono** for labels, IDs, and code — reinforces the technical nature of the app
- Animated grid background on login — subtle depth without distraction
- Role-differentiated avatar gradients (admin = teal+blue, user = blue+purple)
- Skeleton loaders instead of spinners for perceived performance
- Toast notifications for all async feedback

---

## 🔐 Security Highlights

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT tokens expire in **1 hour**
- Role validated on **every protected API endpoint**
- Cannot delete your own admin account
- Max API delay capped at **10 seconds** server-side

---

## 📦 Extending to Real Database

The `src/data/store.ts` file is the only thing to replace. Swap it with:

**MongoDB:**
```typescript
import mongoose from 'mongoose';
// Replace db.users / db.records with mongoose model calls
```

**AWS DynamoDB:**
```typescript
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// Replace with DynamoDB SDK calls
```

The rest of the codebase (controllers, routes, middleware) stays identical.

---

## 👨‍💻 Author

Built as part of a full-stack evaluation demonstrating:
- Angular framework architecture patterns
- RESTful API design with TypeScript
- JWT authentication & RBAC
- Async processing visualization
- Clean modular code architecture