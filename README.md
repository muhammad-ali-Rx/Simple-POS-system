# 🚀 SaaS POS System (Multi-Tenant Restaurant & Retail Management)

A modern **SaaS-based Point of Sale (POS) System** built with:

- ⚡ React + Vite + TypeScript (Frontend)
- 🟢 Node.js + Express + TypeScript (Backend)
- 🍃 MongoDB (Database)
- 🔐 JWT Authentication
- 🏢 Multi-Tenant Architecture

This system allows multiple restaurants or retail businesses to use the same platform securely with complete data isolation.

---

# 🏢 SaaS Architecture (Multi-Tenant)

This project follows a **Multi-Tenant Architecture**:

- Each business = **Tenant (Restaurant)**
- Each tenant has:
  - Users (Admin / Staff)
  - Inventory
  - Orders
  - Reports
- All data is filtered using `tenantId`
- Single backend, multiple businesses

✅ Secure  
✅ Scalable  
✅ SaaS Ready  

---

# ✨ Core Features

## 🔐 Authentication
- JWT Login
- Role-based access (Admin / Staff)
- Tenant-based authorization

## 🏪 Restaurant / Tenant Management
- Create & manage tenants
- Tenant-level dashboard
- Plan-based structure ready

## 📦 Inventory Management
- Add / Update / Delete products
- Stock tracking
- Category management

## 🧾 POS Terminal
- Billing system
- Order processing
- Receipt generation

## 👥 Staff Management
- Add staff members
- Role control
- Tenant isolation

## 📊 Analytics Dashboard
- Sales overview
- Revenue tracking
- Business insights

## 🤖 AI Integration Ready
- Gemini service integration
- AI analytics or chatbot expansion ready

---

# 🛠️ Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Modular Component Architecture

## Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication

---

# 📁 Project Structure

```
POS/
│
├── backend/
│   ├── config/
│   │   ├── db.ts
│   │   └── seed.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── tenantController.ts
│   │
│   ├── middleware/
│   │   ├── tenant.ts
│   │   └── uploads.ts
│   │
│   ├── models/
│   │   ├── Restaurant.ts
│   │   └── User.ts
│   │
│   ├── routes/
│   │   └── api.ts
│   │
│   ├── scripts/
│   │   ├── seed-runner.ts
│   │   └── seed.ts
│   │
│   └── server.ts
│
├── components/
│   ├── Analytics.tsx
│   ├── Billing.tsx
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Login.tsx
│   ├── POSTerminal.tsx
│   ├── Sidebar.tsx
│   ├── StaffManagement.tsx
│   └── TenantManagement.tsx
│
├── services/
│   ├── api.ts
│   └── geminiService.ts
│
├── uploads/
│
├── App.tsx
├── constants.tsx
├── index.tsx
├── types.ts
├── vite.config.ts
├── package.json
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/muhammad-ali-Rx/Simple-POS-system
cd Simple-POS-system
```

---

## 2️⃣ Install Frontend Dependencies

```bash
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 4️⃣ Environment Variables

Create `.env` inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

If using Gemini AI:

```
GEMINI_API_KEY=your_key_here
```

---

## 5️⃣ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

# 🔐 SaaS Tenant Flow

1. Tenant (Restaurant) registers
2. Admin user created with `tenantId`
3. User logs in → JWT generated
4. Middleware extracts `tenantId`
5. Every query filtered by tenant

Result:

✔ Secure data isolation  
✔ No cross-tenant data access  
✔ Production-ready SaaS structure  

---

# 👥 User Roles

## Admin
- Manage inventory
- Manage staff
- View analytics
- Manage restaurant settings

## Staff
- Use POS terminal
- Create orders
- Process billing

---

# 📊 API Structure (Example)

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/tenant | Get Tenant |
| GET | /api/products | Get Products |
| POST | /api/products | Create Product |

---

# 💰 SaaS Expansion Ready

This project is ready for:

- Stripe Subscription Integration
- Plan-based Feature Locking
- Subdomain Tenants (restaurantA.app.com)
- Super Admin Dashboard
- Cloud Deployment
- Enterprise Scaling

---

# 🚀 Deployment

Frontend:
- Vercel
- Netlify

Backend:
- Render
- Railway
- VPS

Database:
- MongoDB Atlas

---

# 🧠 Future Improvements

- Barcode Scanner Support
- Cloud File Storage (S3)
- PWA Mode
- Real-Time Dashboard (WebSockets)
- Advanced Reports & Exports
- AI Sales Predictions

---

# 👨‍💻 Author

Muhammad Ali  
Full Stack Developer (MERN + TypeScript)

---

# 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, give it a star on GitHub!
