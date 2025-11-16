# Smart Calendar - Time Blocking for Maximum Productivity

## Overview
A full-stack web application for smart time blocking and task management with AI-powered scheduling assistance. Built with React, Express, PostgreSQL, and OpenAI.

## Features
- **User Authentication**: Secure login with Replit Auth (supports Google, GitHub, X, Apple, and email/password)
- **Dashboard**: Overview of tasks, time blocks, and productivity metrics
- **Weekly To-Do**: Kanban-style task management with status tracking (To Do, In Progress, Completed)
- **Calendar View**: Visual time blocking with drag-and-drop scheduling
- **Inbox**: Quick capture for ideas and unscheduled tasks
- **AI Assistant**: Intelligent scheduling suggestions powered by OpenAI GPT-5
- **Settings**: Customizable work hours, task preferences, and notifications
- **Profile**: User account management

## Tech Stack
### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS with custom earth-tone theme (#414A37, #99744A, #DBC2A6)
- Date-fns for date manipulation

### Backend
- Express.js with TypeScript
- PostgreSQL (Neon) database
- Drizzle ORM for database operations
- Passport.js with OpenID Connect for authentication
- OpenAI API integration for AI features

## Setup Instructions

### 1. Environment Variables
The following environment variables are automatically configured in Replit:
- `DATABASE_URL`: PostgreSQL connection string (auto-configured with Replit PostgreSQL)
- `SESSION_SECRET`: Secret key for session management (auto-configured)
- `OPENAI_API_KEY`: OpenAI API key for AI features (required - add in Secrets)
- `REPL_ID`: Replit project ID (auto-configured in Replit environment)
- `ISSUER_URL`: OIDC issuer URL (defaults to https://replit.com/oidc)

### 2. Database Setup
After provisioning the PostgreSQL database, run:
```bash
npm run db:push
```
This command syncs the database schema defined in `shared/schema.ts` and creates all necessary tables:
- `users`: User accounts with Replit Auth integration
- `sessions`: Session storage for authentication (auto-created by connect-pg-simple)
- `tasks`: Task items with status, priority, and time estimates
- `time_blocks`: Scheduled time blocks on the calendar
- `inbox_items`: Quick capture items
- `user_settings`: User preferences and settings

### 3. Running the Application
```bash
npm run dev
```
The application will be available at the Replit webview URL.

### 4. First-Time Setup
1. Ensure PostgreSQL is provisioned in your Replit project
2. Run `npm run db:push` to create the database schema
3. Add your `OPENAI_API_KEY` in the Secrets tab (optional - AI features will show a fallback message without it)
4. Start the application with `npm run dev`
5. Click "Sign in with Replit" on the landing page to authenticate

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main application component
├── server/                # Backend Express application
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # Database operations
│   ├── replitAuth.ts      # Authentication setup
│   ├── openai.ts          # OpenAI integration
│   └── db.ts              # Database connection
└── shared/                # Shared TypeScript types
    └── schema.ts          # Database schema and validation

```

## Development
The application runs with `npm run dev`:
- Frontend: Vite dev server with HMR
- Backend: Express server on port 5000
- Database: PostgreSQL with automatic migrations

## Database Migrations
Use `npm run db:push` to sync schema changes to the database. The schema is defined in `shared/schema.ts` using Drizzle ORM.

## Custom Color Theme
The application uses a custom earth-tone palette:
- Primary (#414A37): Dark Olive - used for sidebar, headers, primary actions
- Secondary (#99744A): Warm Brown - used for accents, hover states
- Background (#DBC2A6): Warm Beige - used for main backgrounds

Both light and dark modes are supported with automatic theme adaptation.

## Recent Changes
- 2025-11-16: Initial application setup with all core features
  - Implemented Replit Auth integration for user authentication
  - Created database schema with all necessary tables
  - Built all frontend pages with custom color theme
  - Integrated OpenAI for AI assistant functionality
  - Added comprehensive CRUD operations for all features
  - Configured session management with PostgreSQL storage
