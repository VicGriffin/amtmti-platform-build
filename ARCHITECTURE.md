# AMTMTI Platform Architecture

## Overview

The AMTMTI (Africa Medication Therapy Management Training Institute) Platform is a comprehensive educational and membership management system built with Next.js 16, Supabase, and modern web technologies.

## System Architecture

### 1. Frontend Layer

**Technology Stack:**
- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- Shadcn/UI Components
- Framer Motion (animations)

**Structure:**
```
app/
├── (marketing)/          # Public marketing pages
│   ├── page.tsx          # Homepage
│   ├── about/            # About page
│   ├── programs/         # Programs listing
│   ├── research/         # Research division
│   ├── news/             # News articles
│   ├── membership/       # Membership plans
│   └── contact/          # Contact form
├── portal/               # Student portal (protected)
│   ├── page.tsx          # Dashboard
│   ├── enrollments/      # My enrollments
│   ├── resources/        # Learning materials
│   └── profile/          # Profile settings
├── admin/                # Admin dashboard (protected)
│   ├── login/            # Admin login
│   └── (dashboard)/      # Admin pages
│       ├── programs/
│       ├── enrollments/
│       ├── applications/
│       ├── news/
│       └── events/
└── api/                  # API routes
    ├── admin/            # Admin endpoints
    ├── programs/         # Program CRUD
    ├── enrollments/      # Enrollment management
    ├── applications/     # Application processing
    └── news/             # News management
```

### 2. Backend Layer

**Server Architecture:**
- Next.js Server Actions for data mutations
- REST API Routes for direct access
- Middleware for authentication and authorization
- Admin service role for privileged operations

**Database:**
- Supabase PostgreSQL
- 18 tables with proper relationships
- Row-Level Security (RLS) policies
- Indexes for performance
- Audit logging capabilities

**Core Server Actions:**
- `app/actions/auth.ts` - Authentication flows
- `app/actions/enrollments.ts` - Enrollment management
- `app/actions/contact.ts` - Form submissions
- `app/actions/admin.ts` - Admin CRUD operations
- `app/actions/marketing.ts` - Public data fetching
- `app/portal/actions.ts` - Student portal operations
- `app/admin/(dashboard)/actions.ts` - Dashboard operations

### 3. Database Layer

**Schema Overview:**

#### Core Tables
- **users** - Supabase auth users
- **profiles** - User profile information
- **programs** - Educational programs
- **courses** - Program courses
- **lessons** - Course lessons

#### Enrollment Tables
- **enrollments** - Program enrollments
- **payments** - Payment records
- **certificates** - Earned certificates

#### Content Tables
- **news** - News articles
- **events** - Upcoming events
- **research_projects** - Research initiatives
- **publications** - Research publications

#### Administrative Tables
- **membership_applications** - Membership requests
- **contact_messages** - Contact form submissions
- **newsletter_emails** - Newsletter subscribers
- **notifications** - User notifications
- **audit_logs** - Operation audit trail
- **partners** - Partner organizations

**Security:**
- RLS policies for student and admin access
- Service role key for admin operations
- User authentication via Supabase Auth
- Admin token-based sessions

### 4. Authentication & Authorization

**Student Authentication:**
- Email/password signup and login
- Supabase Auth managed
- JWT tokens with refresh capability
- Session persistence

**Admin Authentication:**
- Fixed credentials via environment variables
- Token-based sessions (8-hour expiration)
- Cookie-based persistence
- Admin middleware protection

**Authorization:**
- `requireUser()` - Student portal protection
- `requireAdmin()` - Admin dashboard protection
- RLS policies - Database-level access control
- API route guards

### 5. API Routes

**Public APIs:**
```
GET    /api/programs               - List programs
GET    /api/programs/[id]          - Get program details
GET    /api/news                   - List news articles
GET    /api/enrollments            - Get enrollments
POST   /api/enrollments            - Create enrollment
```

**Admin APIs:**
```
POST   /api/admin/login            - Admin login
GET    /api/admin/stats            - Dashboard statistics
POST   /api/programs               - Create program
PUT    /api/programs/[id]          - Update program
DELETE /api/programs/[id]          - Delete program
POST   /api/enrollments/[id]/approve - Approve enrollment
POST   /api/applications/[id]/approve - Approve application
```

## Key Features

### 1. Program Management
- Full CRUD operations for programs
- Category-based organization
- Multiple delivery modes (Online, In-Person, Hybrid)
- Pricing and duration tracking
- Featured program showcase

### 2. Enrollment System
- Student program enrollment
- Progress tracking
- Payment management (API-ready)
- Certificate generation
- Status workflows (pending, active, completed)

### 3. Membership System
- Three-tier membership (Student, Affiliate, Corporate)
- Application workflow
- Admin approval process
- Membership benefits management

### 4. Admin Dashboard
- Real-time statistics
- Program management
- Enrollment processing
- Application review
- News and event management
- Message inbox
- Research project tracking

### 5. Student Portal
- Dashboard with enrollments
- Course progress tracking
- Certificate viewing
- Notification system
- Profile management
- Learning resource access

### 6. Content Management
- News articles with categories
- Event management with registration
- Research project showcase
- Partner organization listings
- Testimonial management

## Data Flow

### Enrollment Flow
```
1. Student browses programs
2. Student clicks enroll
3. Payment modal opens
4. Payment request created
5. Enrollment marked "pending"
6. Admin approves enrollment
7. Enrollment marked "active"
8. Student accesses course materials
9. Student completes lessons
10. Certificate generated on completion
```

### Admin Workflow
```
1. Admin logs in with credentials
2. Session created with token
3. Access admin dashboard
4. View statistics and pending actions
5. Approve enrollments/applications
6. Manage content (programs, news, events)
7. Session expires after 8 hours
```

## Security Measures

### Authentication
- Supabase Auth for students
- Fixed credentials for admin
- Token-based session management
- Secure cookie storage

### Authorization
- RLS policies on all tables
- User-scoped queries
- Admin middleware protection
- API route verification

### Data Protection
- Parameterized queries
- Input validation (Zod schemas)
- CSRF protection
- Rate limiting
- Audit logging

### Infrastructure
- HTTPS only
- Secure environment variables
- Service role key protected
- No sensitive data in logs

## Performance Optimization

### Database
- Indexes on frequently queried fields
- Efficient relationship queries
- Pagination support
- Query optimization

### Frontend
- Server-side rendering
- Incremental static regeneration
- Image optimization
- Code splitting
- CSS minimization

### Caching
- Revalidation tags for cache invalidation
- Client-side SWR for data fetching
- Browser caching headers

## Development Practices

### Code Organization
- Modular component structure
- Separation of concerns
- Reusable utilities and hooks
- Consistent naming conventions

### Error Handling
- Custom error classes
- Comprehensive logging
- User-friendly error messages
- Error recovery mechanisms

### Type Safety
- Full TypeScript coverage
- Zod schema validation
- Type-safe API responses

## Deployment

### Requirements
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (optional)

### Environment Setup
```bash
# Set environment variables
cp .env.example .env.local

# Install dependencies
npm install

# Run migrations (if needed)
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### Production Checklist
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Admin credentials configured
- [ ] Email notifications configured
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] SSL/TLS certificates
- [ ] Domain configured
- [ ] Backup strategy established

## Monitoring

### Metrics to Track
- User signups and active students
- Program enrollments
- Completion rates
- Revenue metrics
- System uptime
- API response times
- Error rates

### Logging
- Application logs via logger utility
- Audit logs for admin actions
- Error tracking integration
- Performance monitoring

## Future Enhancements

### Phase 2
- Payment gateway integration (M-Pesa, Stripe)
- Email notification system
- Advanced search and filtering
- User-generated content
- Discussion forums
- Live video streaming

### Phase 3
- Mobile app (React Native)
- Gamification features
- Advanced analytics
- AI-powered recommendations
- Multi-language support
- Offline access

### Phase 4
- Blockchain certificates
- Integration with academic institutions
- Corporate training partnerships
- API marketplace
- Advanced reporting

## Support

For questions or issues, refer to:
- DEPLOYMENT.md - Setup and deployment guide
- API_DOCUMENTATION.md - API reference
- DEVELOPMENT.md - Developer guide
