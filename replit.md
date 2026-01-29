# AuditaXML - Tax Invoice Management Platform

## Overview

AuditaXML is a web platform for accountants to manage and audit XML invoice files (facturas) uploaded by clients for tax refund procedures. The system allows accountants to track taxpayers (contribuyentes), manage refund processes, handle file uploads with deduplication by UUID, provide feedback to clients, and generate consolidated downloads and work papers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state, React Context for local state (mock data, theme)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving from built assets

### Data Layer
- **Current State**: Frontend-only demo using React Context for simulated data (no backend API calls)
- **Mock Data Provider**: `client/src/lib/mock-data.tsx` - Provides simulated CRUD operations for all entities
- **Schema Location**: `shared/schema.ts` - TypeScript types and enums (ProcessStatus)
- **Validation**: Zod schemas for form validation
- **Sample Data**: 4 taxpayers with various processes, uploads, and XML files pre-loaded

### Key Data Models
- **Taxpayers**: Client information (RFC, name, regime, contact details)
- **Processes**: Tax refund procedures linked to taxpayers with status workflow
- **Uploads**: File upload batches (deliveries) within processes
- **XmlFiles**: Individual XML files with UUID-based deduplication

### Process Status Workflow
States: `pending_review` → `incomplete` / `in_review` → `corrected` → `finalized`
- Status changes trigger automatic behaviors (e.g., downloading files sets status to "In Review")
- Finalized processes are locked from new uploads

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # Reusable UI components
    components/ui/ # shadcn/ui components
    pages/        # Route components
    lib/          # Utilities and mock data
    hooks/        # Custom React hooks
server/           # Backend Express application
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data access layer
  vite.ts         # Vite dev server integration
shared/           # Shared code between client/server
  schema.ts       # Database schema and types
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Schema migrations (`npm run db:push`)

### UI Framework Dependencies
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **date-fns**: Date formatting with Spanish locale support

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod integration for validation

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available for future auth implementation)
- **express-session**: Session middleware

### Build and Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development