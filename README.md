# ScopeX - Admin Dashboard with Role-Based Access Control (RBAC)

A modern, full-stack admin dashboard built with Next.js 14, featuring comprehensive role-based access control, user management, project tracking, and task assignment capabilities.

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication** with secure httpOnly cookies
- **Role-Based Access Control (RBAC)** with three user roles:
  - **Admin**: Full system access, user management, reports, audit logs
  - **Manager**: Project and team management, task assignment
  - **User**: View and update assigned tasks, profile management
- **Protected Routes** with middleware-based authorization
- **Dynamic UI Rendering** based on user roles

### Admin Features
- **User Management**: Create, edit, delete users and assign roles
- **Dashboard**: System-wide statistics and analytics
- **Reports**: User distribution by role, task status breakdown
- **Audit Logs**: Complete activity tracking with filtering
- **CSV Export**: Export user data for reporting

### Manager Features
- **Project Management**: Create, edit, and delete projects
- **Team Management**: View team members and their workload
- **Task Assignment**: Assign tasks to team members with status tracking
- **Project Overview**: Monitor task counts per project

### User Features
- **Kanban Board**: Visual task management with drag-and-drop status updates
- **Task Filtering**: Filter tasks by status (To Do, In Progress, Done)
- **Profile Management**: Update personal information and password

### UI/UX Features
- **Dark Mode**: System-wide theme toggle
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: Built with custom UI components
- **Search & Filter**: Real-time search across users, projects, and tasks
- **Loading States**: Smooth transitions and feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with jose library
- **Icons**: Lucide React
- **Theme**: next-themes

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   cd scopex-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env` file should already exist with:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-12345"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   $env:DATABASE_URL="file:./dev.db"; npx prisma migrate dev --name init
   ```

6. **Seed the database**
   ```bash
   npm run db:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 👤 Demo Credentials

The seeded database includes three demo accounts:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@scopex.com       | password123 |
| Manager | manager@scopex.com     | password123 |
| User    | user@scopex.com        | password123 |

Additional users:
- john@scopex.com / password123 (User)
- jane@scopex.com / password123 (User)

## 📁 Project Structure

```
scopex-admin/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page
│   ├── admin/                  # Admin-only pages
│   │   ├── page.tsx           # Admin dashboard
│   │   ├── users/             # User management
│   │   ├── reports/           # Reports & analytics
│   │   └── audit-logs/        # Audit logs
│   ├── manager/                # Manager-only pages
│   │   ├── page.tsx           # Manager dashboard
│   │   ├── projects/          # Project management
│   │   └── team/              # Team & task assignment
│   ├── user/                   # User pages
│   │   └── page.tsx           # My tasks (Kanban)
│   ├── profile/                # Common profile page
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── users/             # User CRUD
│   │   ├── projects/          # Project CRUD
│   │   ├── tasks/             # Task CRUD
│   │   ├── reports/           # Analytics
│   │   └── audit-logs/        # Audit log retrieval
│   ├── layout.tsx             # Root layout with theme provider
│   └── page.tsx               # Root redirect to login
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   └── select.tsx
│   ├── dashboard-layout.tsx    # Main dashboard wrapper
│   ├── navbar.tsx              # Top navigation bar
│   ├── sidebar.tsx             # Role-based sidebar
│   ├── theme-provider.tsx      # Dark mode provider
│   └── theme-toggle.tsx        # Theme switcher
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── db.ts                   # Prisma client
│   └── utils.ts                # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeder
│   └── migrations/             # Migration files
├── types/
│   └── index.ts                # TypeScript type definitions
└── middleware.ts               # Route protection middleware
```

## 🔐 Roles & Permissions Logic

### Role Hierarchy
```
Admin > Manager > User
```

### Permission Matrix

| Feature                    | Admin | Manager | User |
|----------------------------|-------|---------|------|
| View Dashboard             | ✅    | ✅      | ✅   |
| Manage Users               | ✅    | ❌      | ❌   |
| View All Users             | ✅    | ❌      | ❌   |
| Create/Edit/Delete Users   | ✅    | ❌      | ❌   |
| Assign Roles               | ✅    | ❌      | ❌   |
| View Reports               | ✅    | ❌      | ❌   |
| View Audit Logs            | ✅    | ❌      | ❌   |
| Manage Projects            | ✅    | ✅      | ❌   |
| Create/Edit/Delete Projects| ✅    | ✅      | ❌   |
| View All Projects          | ✅    | ✅      | ❌   |
| Assign Tasks               | ✅    | ✅      | ❌   |
| View Team Members          | ✅    | ✅      | ❌   |
| View All Tasks             | ✅    | ✅      | ❌   |
| View Own Tasks             | ✅    | ✅      | ✅   |
| Update Task Status         | ✅    | ✅      | ✅   |
| Update Profile             | ✅    | ✅      | ✅   |

### Implementation Details

**Middleware Protection** (`middleware.ts`):
- Verifies JWT token from cookies
- Redirects unauthenticated users to `/login`
- Enforces role-based route access:
  - `/admin/*` → Admin only
  - `/manager/*` → Admin & Manager
  - `/user/*` → All authenticated users
  - `/profile` → All authenticated users

**API Route Protection**:
- `requireAuth()`: Ensures user is authenticated
- `requireRole(['ADMIN', 'MANAGER'])`: Enforces role-based access
- Returns 401 for unauthenticated, 403 for unauthorized

**Dynamic UI Rendering**:
- Sidebar menu items filtered by role
- Dashboard widgets show role-appropriate data
- Action buttons hidden based on permissions

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   (hashed with bcrypt)
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Project Model
```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Task Model
```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  projectId   String
  assignedToId String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

### AuditLog Model
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  action    String
  userId    String
  details   String?
  createdAt DateTime @default(now())
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users (with search & filter)
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Projects (Admin & Manager)
- `GET /api/projects` - List all projects (with search)
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks (Role-based access)
- `GET /api/tasks` - List tasks (filtered by role)
- `POST /api/tasks` - Create new task (Admin & Manager)
- `GET /api/tasks/[id]` - Get task by ID
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task (Admin & Manager)

### Reports (Admin only)
- `GET /api/reports` - Get system-wide statistics

### Audit Logs (Admin only)
- `GET /api/audit-logs` - Get audit logs (with filtering)

## 🎨 Key Components

### Reusable UI Components
- **Button**: Multiple variants (default, destructive, outline, ghost, link)
- **Card**: Container with header, content, and footer sections
- **Input**: Styled form input with focus states
- **Table**: Responsive data table with sorting
- **Badge**: Status indicators with color variants
- **Select**: Dropdown select component

### Layout Components
- **DashboardLayout**: Main wrapper with navbar and sidebar
- **Navbar**: Top bar with user info, theme toggle, and logout
- **Sidebar**: Role-based navigation menu
- **ThemeProvider**: Dark mode context provider

## 🌟 Bonus Features Implemented

✅ **Dark Mode**: Full theme support with system preference detection  
✅ **CSV Export**: Export user list from admin panel  
✅ **Search & Filter**: Real-time search across all data tables  
✅ **Responsive Design**: Mobile-optimized layouts  
✅ **Audit Logging**: Complete activity tracking  
✅ **Kanban Board**: Visual task management for users  

## 📝 Architecture Choices

### Why Next.js 14 App Router?
- **Server Components**: Improved performance with server-side rendering
- **API Routes**: Built-in API endpoints without separate backend
- **Middleware**: Native route protection support
- **File-based Routing**: Intuitive project structure

### Why SQLite + Prisma?
- **Easy Setup**: No external database server required
- **Type Safety**: Auto-generated TypeScript types
- **Migration System**: Version-controlled schema changes
- **Development Speed**: Quick iterations during development

### Why JWT with httpOnly Cookies?
- **Security**: XSS protection with httpOnly flag
- **Stateless**: No server-side session storage needed
- **Scalability**: Easy to scale horizontally
- **Standard**: Industry-standard authentication method

### Component Architecture
- **Server Components by Default**: Better performance
- **Client Components When Needed**: Interactive features
- **Separation of Concerns**: Business logic in API routes
- **Reusable UI Library**: Consistent design system

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- **Netlify**: Supports Next.js with adapter
- **Railway**: Full-stack deployment with database
- **Render**: Free tier available

**Note**: For production, migrate from SQLite to PostgreSQL or MySQL.

## 🔒 Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens stored in httpOnly cookies
- CSRF protection via SameSite cookie attribute
- Input validation on all API endpoints
- SQL injection prevention via Prisma ORM
- Role-based authorization on all protected routes

## 📚 Key Learnings

1. **Role-Based Access Control**: Implementing granular permissions across UI and API
2. **Next.js App Router**: Leveraging server components for better performance
3. **Type Safety**: Using TypeScript and Prisma for end-to-end type safety
4. **Authentication Flow**: Secure JWT implementation with refresh logic
5. **Component Reusability**: Building a scalable UI component library
6. **Database Design**: Modeling relationships for RBAC systems

## 🐛 Known Issues

- Profile update requires admin role for API call (needs user-specific endpoint)
- Dark mode flash on initial load (can be improved with cookie-based theme)
- CSV export doesn't include pagination for large datasets

## 🔮 Future Enhancements

- [ ] Google OAuth integration
- [ ] Email notifications for task assignments
- [ ] Real-time updates with WebSockets
- [ ] File upload for user avatars
- [ ] Advanced analytics dashboard
- [ ] Task comments and attachments
- [ ] Team chat functionality
- [ ] Mobile app with React Native

## 📄 License

This project is created for educational purposes as part of a fullstack internship assignment.

## 👨‍💻 Author

Built with ❤️ for the ScopeX Fullstack Intern Assignment

---

**Need Help?** Check the demo credentials above or review the setup instructions.
