# AMTMTI Platform - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account
- Text editor (VS Code recommended)

### Step 1: Clone & Install (2 min)
```bash
# Clone the repository
git clone <your-repo-url>
cd amtmti-platform

# Install dependencies
npm install
```

### Step 2: Configure Environment (1 min)
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your Supabase credentials
# Get these from Supabase dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Setup Database (2 min)
```bash
# Copy the schema and RLS policies from the files
# lib/supabase/schema.sql
# lib/supabase/rls-policies.sql
# 
# Run them in your Supabase SQL editor at:
# https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql

# Or use the seed script to add sample data
npm run db:seed
```

### Step 4: Run Development Server (30 seconds)
```bash
npm run dev
```

Visit `http://localhost:3000` - your platform is live!

## Quick Access URLs

**Marketing Website**
- Homepage: http://localhost:3000
- Programs: http://localhost:3000/programs
- News: http://localhost:3000/news
- About: http://localhost:3000/about

**Student Portal**
- Register: http://localhost:3000/register
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/portal

**Admin Dashboard**
- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin
- Programs: http://localhost:3000/admin/programs
- Enrollments: http://localhost:3000/admin/enrollments

## Default Admin Credentials

Add to your `.env.local`:
```
ADMIN_EMAIL=admin@amtmti.org
ADMIN_PASSWORD=your_secure_password_here
ADMIN_SESSION_SECRET=generate_with_openssl_rand_base64_32
```

Generate a secure session secret:
```bash
openssl rand -base64 32
```

## Testing the Platform

### As a Student
1. Go to http://localhost:3000
2. Click "Enroll Now" or go to /register
3. Create an account
4. Browse programs
5. Enroll in a program
6. Visit portal/dashboard

### As an Admin
1. Go to http://localhost:3000/admin/login
2. Login with your admin credentials
3. View dashboard statistics
4. Manage programs, enrollments, news, events
5. Approve applications and enrollments

## Database Schema Quick Reference

### Core Tables
- **programs** - Educational programs
- **enrollments** - Student enrollments
- **users** - User accounts
- **profiles** - User profiles

### Content Tables
- **news** - News articles
- **events** - Events
- **research_projects** - Research initiatives
- **publications** - Research papers

### Administrative Tables
- **membership_applications** - Membership requests
- **contact_messages** - Contact form submissions
- **certificates** - Earned certificates
- **audit_logs** - Operation audit trail

## API Quick Reference

### Get Programs
```bash
curl http://localhost:3000/api/programs
```

### Get News
```bash
curl http://localhost:3000/api/news
```

### Get Admin Stats (requires admin auth)
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

See `API_DOCUMENTATION.md` for complete API reference.

## Common Tasks

### Add a New Program (Admin)
1. Go to /admin/programs
2. Click "Create Program"
3. Fill in program details
4. Set category, level, mode, price
5. Add description and outcomes
6. Click Create
7. Go back to programs and Publish

### Enroll a Student (Student)
1. Browse programs at /programs
2. Click a program
3. Click "Enroll Now"
4. Select payment method (mock payment)
5. Complete enrollment
6. View in student portal

### Approve Enrollment (Admin)
1. Go to /admin/enrollments
2. Find pending enrollment
3. Click Actions
4. Click Approve
5. Enrollment becomes active

### Create News Article (Admin)
1. Go to /admin/news
2. Click "Create Article"
3. Fill in title, content, category
4. Click Create
5. Click Publish to make it visible

## Troubleshooting

### "Database connection failed"
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Ensure Supabase project is active
- Verify network connectivity

### "Admin login not working"
- Check ADMIN_EMAIL and ADMIN_PASSWORD
- Ensure ADMIN_SESSION_SECRET is set
- Clear browser cookies and try again

### "Pages not loading"
- Check server is running (npm run dev)
- Clear browser cache
- Check console for errors (F12)

### "Migrations not applied"
- Copy schema.sql and rls-policies.sql to Supabase SQL editor
- Run each script one by one
- Check for errors in Supabase

## Next Steps

1. **Understand the architecture**: Read `ARCHITECTURE.md`
2. **Explore the code**: Start with pages, then actions, then APIs
3. **Customize branding**: Update colors in Tailwind config
4. **Add your content**: Create programs, news, events
5. **Configure email**: Set up email service for notifications
6. **Deploy**: Follow `DEPLOYMENT.md` for production setup

## Key Files to Know

- `app/` - All pages and API routes
- `lib/` - Database clients, utilities, validation
- `components/` - Reusable UI components
- `scripts/seed.ts` - Sample data
- `lib/supabase/schema.sql` - Database schema
- `API_DOCUMENTATION.md` - API reference
- `ARCHITECTURE.md` - System design

## Support

- API docs: `API_DOCUMENTATION.md`
- Architecture: `ARCHITECTURE.md`
- Deployment: `DEPLOYMENT.md`
- Build summary: `BUILD_SUMMARY.md`

## Commands Reference

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production server
npm run db:seed      # Seed sample data
npm run type-check   # Check TypeScript
npm run lint         # Run ESLint
```

## What's Included

✅ Complete database with 18 tables
✅ Student and admin authentication
✅ 20+ pages (marketing, portal, admin)
✅ 30+ server actions
✅ 15+ REST API routes
✅ Admin dashboard with CRUD operations
✅ Student learning portal
✅ Professional marketing website
✅ Error handling and logging
✅ Rate limiting and security
✅ Full documentation

## Ready to Deploy?

When you're ready to go live:

1. **Sign up for hosting**: Vercel (recommended), AWS, Google Cloud, etc.
2. **Configure production database**: Set up Supabase project
3. **Set environment variables**: Add to hosting platform
4. **Deploy**: Follow deployment guide
5. **Monitor**: Set up error tracking and logging
6. **Backup**: Configure database backups

See `DEPLOYMENT.md` for detailed instructions.

---

**You're all set!** Start building the future of education in Africa. 🚀
