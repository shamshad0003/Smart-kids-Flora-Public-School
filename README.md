# Smart Kids Flora Public School - Web Portal

A comprehensive, modern school management and public website built with **Next.js 15+**, **TypeScript**, **Tailwind CSS**, and **Prisma**.

## 🚀 Key Features

### 🌐 Public Website
- **Modern UI/UX**: Professional design with smooth animations using Framer Motion.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Admissions Portal**: Easy-to-use admission form with email notifications.
- **Dynamic Content**: Auto-updating announcements and gallery from the admin panel.

### 🔑 Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admin, Teacher, Student, and Parent.
- **Secure Authentication**: Powerded by NextAuth/Auth.js with JWT and secure password hashing.
- **Hardened Server Actions**: All internal operations protected by server-side role validation.

### 🛡️ Admin Dashboard
- **User Management**: Add, Edit, and Delete Teachers, Students, and Parents.
- **Admissions Management**: Review, approve, or reject student applications.
- **Notifications**: Send targeted notifications to specific roles or all users.
- **School Settings**: Update school contact info and branding.

### 🍎 Teacher Portal
- **Academics**: Manage courses, assignments, and grades.
- **Attendance**: Track student attendance with daily logs.
- **Communication**: Receive administrative notifications.

### 👨‍👩‍👧‍👦 Student & Parent Portal
- **Academic Tracking**: View grades, assignments, and attendance logs.
- **Resource Access**: Download learning materials and view schedules.

## 🛠️ Tech Stack
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/) (Development) / [PostgreSQL](https://www.postgresql.org/) (Production)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Auth.js (NextAuth)](https://authjs.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/)

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `AUTH_SECRET`, `DATABASE_URL`, and SMTP settings.
4. Run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 Documentation
- [Deployment Guide](./deployment_guide.md) - How to move from SQLite to PostgreSQL and deploy to Vercel.
- [Phase 6 Review](./phase6_review.md) - Detailed breakdown of recent feature additions.

## 📝 License
Proprietary. All rights reserved.
