# NoteSphere
**Secure Multi-Tenant Notes Management Platform**

## Project Structure

### Frontend
```
notes-frontend/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   └── NoteItem.js
│   ├── context/
│   │   └── TenantContext.js
│   ├── pages/
│   │   ├── Admin.module.css
│   │   ├── AdminFree.js
│   │   ├── AdminFree.module.css
│   │   ├── AdminPro.js
│   │   ├── AdminPro.module.css
│   │   ├── AuthPage.js
│   │   ├── AuthPage.module.css
│   │   ├── Login.js
│   │   ├── Member.js
│   │   ├── Member.module.css
│   │   └── Register.js
│   ├── api.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── logo.svg
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

### Backend
```
notes-backend/api/
├── models/
│   ├── Note.js
│   ├── Tenant.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── notes.js
│   └── tenants.js
├── utils/
│   └── auth.js
├── index.js
├── seed.js
└── package.json
```

## Multi-Tenancy Approach
**Shared Schema with Tenant ID Column**: All data is stored in a single MongoDB database with tenant isolation enforced through a `tenant` field in each document. This approach provides cost-effective resource sharing while maintaining strict data separation.

## Authentication & Authorization

### JWT-Based Authentication
- Token-based authentication with 7-day expiration
- Role-based access control (Admin/Member)

### Test Accounts
| Email | Password | Role | Tenant |
|-------|----------|------|---------|
| admin@acme.test | password | Admin | Acme |
| user@acme.test | password | Member | Acme |
| admin@globex.test | password | Admin | Globex |
| user@globex.test | password | Member | Globex |

### Role Permissions
- **Admin**: Invite users, upgrade subscriptions, manage notes
- **Member**: Create, view, edit, and delete notes only

## Subscription Plans

### Free Plan
- Maximum 3 notes per tenant
- Basic note management features

### Pro Plan
- Unlimited notes
- All features included

### Upgrade Endpoint
```
POST /tenants/:slug/upgrade
```
- Accessible only by Admin users
- Immediately lifts note limits

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Notes Management
```
POST /notes          - Create a note
GET /notes           - List all tenant notes
GET /notes/:id       - Retrieve specific note
PUT /notes/:id       - Update a note
DELETE /notes/:id    - Delete a note
```

### Tenant Management
```
GET /tenants/:slug           - Get tenant information
POST /tenants/:slug/upgrade  - Upgrade to Pro plan
POST /tenants/:slug/invite   - Invite new users (Admin only)
```

## Features

### Multi-Tenant Security
- Strict tenant isolation across all operations
- Data belonging to one tenant is never accessible to another
- Tenant validation on all authenticated endpoints

### Subscription Feature Gating
- Free plan enforces 3-note limit
- Pro plan provides unlimited notes
- Real-time limit enforcement on note creation

### CORS Configuration
- Enabled for automated scripts and dashboards
- Configured origins for production and development

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 19
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Testing**: React Testing Library & Jest
- **UI Enhancements**: React Confetti

## Deployment
- **Platform**: Vercel and Render
- **Backend**: Hosted on Render
- **Frontend**: Static hosting on Vercel
- **Database**: MongoDB Atlas (cloud-hosted)

## Environment Variables
Backend requires:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port 

## Getting Started

### Backend Setup
```bash
cd notes-backend/api
npm install
npm run seed  # Initialize test data
npm run dev   # Development server
npm start     # Production server
```

### Frontend Setup
```bash
cd notes-frontend
npm install
npm start     # Development server
npm run build # Production build
```
