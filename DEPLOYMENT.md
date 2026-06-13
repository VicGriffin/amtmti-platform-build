# AMTMTI Platform Deployment Guide

This guide covers deploying the AMTMTI platform to production.

## Prerequisites

- Node.js 18+
- Supabase account and project
- Vercel account (for deployment)
- Environment variables configured

## Environment Variables

### Required for All Environments

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Admin Authentication
ADMIN_EMAIL=admin@amtmti.org
ADMIN_PASSWORD=your-secure-password
ADMIN_PASSWORD_HASH=bcrypt-hash-of-password

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys

### 2. Run Database Migrations

```bash
# Apply schema
pnpm exec supabase db push

# Or manually run schema.sql from lib/supabase/schema.sql in Supabase SQL Editor
```

### 3. Apply RLS Policies

```bash
# Run RLS policies from lib/supabase/rls-policies.sql in Supabase SQL Editor
```

### 4. Seed Database

```bash
# With Node.js
node --env-file-if-exists=/path/to/.env.local scripts/seed.ts

# Or using tsx
pnpm exec tsx scripts/seed.ts
```

## Admin User Setup

1. Generate bcrypt hash of your admin password:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"
```

2. Set environment variables:
```env
ADMIN_EMAIL=admin@amtmti.org
ADMIN_PASSWORD=your-secure-password
ADMIN_PASSWORD_HASH=your-bcrypt-hash
```

3. Access admin dashboard at `/admin`

## Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Production Deployment to Vercel

### 1. Connect GitHub Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables in project settings

### 2. Configure Environment Variables in Vercel

Add all required environment variables in Vercel project settings.

### 3. Configure Custom Domain

1. Add custom domain in Vercel project settings
2. Update DNS records as instructed
3. Configure SSL certificate (automatic with Vercel)

### 4. Deploy

```bash
# Manual deployment
vercel deploy --prod

# Or automatic via GitHub push to main branch
```

## Post-Deployment Checklist

- [ ] Verify Supabase connection
- [ ] Test admin login at `/admin`
- [ ] Create initial programs in admin dashboard
- [ ] Verify student registration works
- [ ] Test enrollment functionality
- [ ] Check payment processing (if integrated)
- [ ] Monitor error logs
- [ ] Set up monitoring/alerting
- [ ] Configure email notifications (if applicable)
- [ ] Test backup and recovery procedures

## Database Backup

### Automated Backups

Supabase provides automated daily backups. To restore:

1. Go to Supabase project settings
2. Navigate to Backups
3. Select backup to restore
4. Confirm restoration

### Manual Backup

```bash
# Export database
pg_dump "postgresql://user:password@db.supabase.co/postgres" > backup.sql

# Import backup
psql "postgresql://user:password@db.supabase.co/postgres" < backup.sql
```

## Monitoring

### Key Metrics to Monitor

- API response times
- Error rates
- Database performance
- Authentication failures
- Enrollment creation rate
- Student login frequency

### Supabase Monitoring

- Enable logs in Supabase dashboard
- Monitor API usage and limits
- Check database performance metrics

### Application Monitoring

Consider using:
- Sentry for error tracking
- LogRocket for user session replay
- Vercel Analytics for performance

## Scaling Considerations

### Database Performance

1. **Indexes**: Ensure indexes on frequently queried fields:
   - `enrollments.student_id`
   - `enrollments.status`
   - `programs.is_published`
   - `news.is_published`

2. **Connection Pooling**: Supabase handles this automatically

3. **Query Optimization**: Monitor slow queries in Supabase dashboard

### Application Performance

1. **Caching**: 
   - Use Next.js `revalidatePath()` for ISR
   - Implement Redis caching for frequently accessed data
   - Set appropriate `cache-control` headers

2. **Database**: 
   - Use pagination for large result sets
   - Implement filtering to reduce data transfer
   - Consider denormalization for reporting

3. **Assets**:
   - Optimize images with Next.js Image component
   - Use CDN for static assets
   - Enable GZIP compression

## Security

### Recommended Security Measures

1. **Database Security**:
   - Enable RLS on all tables
   - Use service role key only for admin operations
   - Regular security audits

2. **Admin Access**:
   - Strong, unique admin password
   - Regular password rotation
   - Log admin actions (currently in audit_logs table)

3. **User Data**:
   - GDPR compliance for EU users
   - Data encryption for sensitive fields
   - Regular security updates

4. **API Security**:
   - Rate limiting on public endpoints
   - Input validation on all endpoints
   - CORS configuration

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql "postgresql://user:password@db.supabase.co/postgres"

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### Admin Login Issues

1. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
2. Check bcrypt hash generation
3. Clear browser cookies and cache

### Schema Issues

1. Check RLS policies in Supabase dashboard
2. Verify all tables exist
3. Run migrations again if needed

## Support

For issues and questions:
- Check error logs in Vercel/Supabase dashboards
- Review application logs
- Contact technical support team

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
