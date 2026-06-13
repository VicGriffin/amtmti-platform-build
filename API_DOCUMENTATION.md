# AMTMTI Platform API Documentation

## Overview

The AMTMTI platform is built with Next.js and uses Server Actions for client-server communication. All data access goes through Supabase with Row Level Security (RLS) for authentication and authorization.

## Architecture

```
├── app/
│   ├── actions/              # Public server actions
│   │   ├── marketing.ts      # Public content queries
│   │   └── auth.ts           # Authentication actions
│   ├── admin/
│   │   └── (dashboard)/      # Admin pages & actions
│   │       └── actions.ts    # Admin CRUD operations
│   ├── portal/               # Student portal
│   │   └── actions.ts        # Student-specific actions
│   └── api/                  # REST API routes (optional)
├── lib/
│   ├── admin-data.ts         # Admin utilities
│   ├── portal.ts             # Portal utilities
│   └── supabase/
│       ├── server.ts         # Server client
│       ├── admin.ts          # Admin client
│       └── schema.sql        # Database schema
└── components/               # React components
```

## Authentication

### Admin Authentication

Admins authenticate via email/password. The system uses bcrypt for password hashing.

**Login Flow:**
1. User submits email and password
2. System retrieves admin user by email
3. Bcrypt comparison validates password
4. Session token is issued
5. User can access `/admin` routes

**Required Environment Variables:**
```env
ADMIN_EMAIL=admin@amtmti.org
ADMIN_PASSWORD=your-password
ADMIN_PASSWORD_HASH=bcrypt-hash
```

### Student/User Authentication

Uses Supabase Auth with JWT tokens. Students can register and authenticate through the application.

## Database API

### Tables and Operations

#### Programs Table

```sql
-- Retrieve all published programs
SELECT * FROM programs WHERE is_published = true ORDER BY featured DESC, created_at DESC;

-- Search programs
SELECT * FROM programs WHERE is_published = true 
AND (title ILIKE '%query%' OR summary ILIKE '%query%');

-- Filter by category and level
SELECT * FROM programs WHERE is_published = true AND category = 'Data Science' AND level = 'Intermediate';
```

#### Enrollments Table

```sql
-- Get student enrollments
SELECT * FROM enrollments 
WHERE student_id = 'user-id' 
ORDER BY enrolled_at DESC;

-- Get enrollment with program details
SELECT e.*, p.title, p.thumbnail_url 
FROM enrollments e
JOIN programs p ON e.program_id = p.id
WHERE e.student_id = 'user-id';

-- Update enrollment progress
UPDATE enrollments SET progress_percentage = 50 WHERE id = 'enrollment-id';
```

#### News Table

```sql
-- Get published articles
SELECT * FROM news WHERE is_published = true ORDER BY published_at DESC;

-- Get featured articles
SELECT * FROM news WHERE is_published = true AND featured = true LIMIT 3;

-- Get article by slug
SELECT * FROM news WHERE slug = 'article-slug' AND is_published = true;
```

#### Events Table

```sql
-- Get upcoming events
SELECT * FROM events WHERE is_published = true AND date > NOW() ORDER BY date ASC;

-- Get event by slug
SELECT * FROM events WHERE slug = 'event-slug' AND is_published = true;
```

## Server Actions

### Authentication Actions (`app/actions/auth.ts`)

#### `registerAction(formData)`
Register a new student account.

**Parameters:**
- `formData.email`: User email
- `formData.password`: User password
- `formData.fullName`: Full name
- `formData.country`: Country
- `formData.phone`: Phone number (optional)

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
  user?: { id: string; email: string }
}
```

#### `loginAction(formData)`
Login to student account.

**Parameters:**
- `formData.email`: User email
- `formData.password`: User password

**Response:**
```typescript
{
  success: boolean
  session?: { access_token: string }
  error?: string
}
```

### Marketing Actions (`app/actions/marketing.ts`)

#### `getPublishedPrograms(filters?)`
Fetch published programs with optional filtering.

**Parameters:**
```typescript
{
  category?: string
  level?: string
  mode?: string
  search?: string
  page?: number     // Default: 1
  limit?: number    // Default: 10
}
```

**Response:**
```typescript
{
  success: boolean
  programs: Program[]
  total: number
  page: number
  limit: number
  totalPages: number
  error?: string
}
```

#### `getProgramBySlug(slug)`
Get a single program by its slug.

**Parameters:**
- `slug`: Program slug

**Response:**
```typescript
{
  success: boolean
  program: Program | null
  error?: string
}
```

#### `getFeaturedPrograms(limit?)`
Get featured programs for homepage.

**Parameters:**
- `limit`: Number of programs to fetch (default: 6)

**Response:**
```typescript
{
  success: boolean
  programs: Program[]
  error?: string
}
```

#### `getPublishedNews(filters?)`
Fetch published news articles.

**Parameters:**
```typescript
{
  category?: string
  page?: number     // Default: 1
  limit?: number    // Default: 10
}
```

**Response:**
```typescript
{
  success: boolean
  articles: NewsArticle[]
  total: number
  page: number
  limit: number
  totalPages: number
  error?: string
}
```

#### `getNewsBySlug(slug)`
Get a single news article by slug.

**Parameters:**
- `slug`: Article slug

**Response:**
```typescript
{
  success: boolean
  article: NewsArticle | null
  error?: string
}
```

#### `getFeaturedNews(limit?)`
Get featured news for homepage.

**Parameters:**
- `limit`: Number of articles (default: 3)

**Response:**
```typescript
{
  success: boolean
  articles: NewsArticle[]
  error?: string
}
```

#### `getPublishedEvents(filters?)`
Fetch published events.

**Parameters:**
```typescript
{
  page?: number           // Default: 1
  limit?: number          // Default: 10
  futureOnly?: boolean    // Show only upcoming events
}
```

**Response:**
```typescript
{
  success: boolean
  events: Event[]
  total: number
  page: number
  limit: number
  totalPages: number
  error?: string
}
```

#### `getUpcomingEvents(limit?)`
Get upcoming events for homepage.

**Parameters:**
- `limit`: Number of events (default: 3)

**Response:**
```typescript
{
  success: boolean
  events: Event[]
  error?: string
}
```

#### `getPlatformStats()`
Get platform statistics for about/homepage.

**Response:**
```typescript
{
  success: boolean
  stats: {
    students: number
    programs: number
    completedEnrollments: number
    partners: number
  }
  error?: string
}
```

### Portal Actions (`app/portal/actions.ts`)

#### `getStudentEnrollments()`
Get current student's enrollments.

**Response:**
```typescript
{
  success: boolean
  enrollments: EnrollmentWithProgram[]
  error?: string
}
```

#### `getEnrollmentProgress(enrollmentId)`
Get enrollment progress details.

**Parameters:**
- `enrollmentId`: Enrollment ID

**Response:**
```typescript
{
  success: boolean
  enrollment: Enrollment | null
  completedLessons: CompletedLesson[]
  error?: string
}
```

#### `completeLessonAction(enrollmentId, lessonId)`
Mark a lesson as complete.

**Parameters:**
- `enrollmentId`: Enrollment ID
- `lessonId`: Lesson ID

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `updateProfileAction(formData)`
Update student profile.

**Parameters:**
- `formData.fullName`: Full name
- `formData.phone`: Phone number
- `formData.country`: Country
- `formData.profession`: Profession

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `getStudentCertificates()`
Get student's earned certificates.

**Response:**
```typescript
{
  success: boolean
  certificates: Certificate[]
  error?: string
}
```

#### `getStudentNotifications()`
Get student's notifications.

**Response:**
```typescript
{
  success: boolean
  notifications: Notification[]
  error?: string
}
```

#### `markNotificationReadAction(notificationId)`
Mark notification as read.

**Parameters:**
- `notificationId`: Notification ID

**Response:**
```typescript
{
  success: boolean
  error?: string
}
```

### Admin Actions (`app/admin/(dashboard)/actions.ts`)

#### `createProgram(formData)`
Create a new program.

**Parameters:**
- `formData.title`: Program title
- `formData.slug`: URL slug
- `formData.category`: Category
- `formData.level`: Level
- `formData.mode`: Delivery mode
- `formData.summary`: Program summary
- `formData.description`: Detailed description
- `formData.duration`: Duration in weeks
- `formData.feesKsh`: Fees in KSH
- `formData.enrollmentLimit`: Max enrollments

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `updateProgram(id, formData)`
Update a program.

**Parameters:**
- `id`: Program ID
- `formData`: Same as createProgram

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `deleteProgram(id)`
Delete a program.

**Parameters:**
- `id`: Program ID

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `setEnrollmentStatus(id, status)`
Update enrollment status.

**Parameters:**
- `id`: Enrollment ID
- `status`: 'active' | 'completed' | 'pending' | 'cancelled'

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `createNews(formData)`
Create a news article.

**Parameters:**
- `formData.title`: Article title
- `formData.slug`: URL slug
- `formData.category`: Category
- `formData.excerpt`: Brief excerpt
- `formData.body`: Article content
- `formData.author`: Author name
- `formData.readMinutes`: Read time in minutes
- `formData.featured`: Featured toggle

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `setNewsPublished(id, published)`
Toggle news publication status.

**Parameters:**
- `id`: News ID
- `published`: Boolean

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

#### `createEvent(formData)`
Create a new event.

**Parameters:**
- `formData.title`: Event title
- `formData.slug`: URL slug
- `formData.description`: Description
- `formData.location`: Location
- `formData.mode`: 'In-Person' | 'Virtual' | 'Hybrid'
- `formData.date`: Event date/time
- `formData.imageUrl`: Banner image URL
- `formData.registrationUrl`: Registration link

**Response:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

## Data Models

### Program
```typescript
{
  id: string
  title: string
  slug: string
  category: string
  level: string
  mode: string
  summary: string
  description: string
  duration: number
  fees_ksh: number
  thumbnail_url?: string
  enrollment_limit: number
  is_published: boolean
  featured: boolean
  created_at: string
  updated_at: string
}
```

### Enrollment
```typescript
{
  id: string
  student_id: string
  program_id: string
  status: 'active' | 'completed' | 'pending' | 'cancelled'
  progress_percentage: number
  enrolled_at: string
  completed_at?: string
}
```

### NewsArticle
```typescript
{
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  category: string
  author: string
  read_minutes: number
  is_published: boolean
  featured: boolean
  published_at?: string
  created_at: string
}
```

### Event
```typescript
{
  id: string
  title: string
  slug: string
  description: string
  location: string
  mode: 'In-Person' | 'Virtual' | 'Hybrid'
  date: string
  image_url?: string
  registration_url?: string
  is_published: boolean
  created_at: string
}
```

## Error Handling

All server actions follow a consistent error response pattern:

```typescript
{
  success: false
  error: 'Human-readable error message'
  // Data fields set to null/empty
}
```

## Rate Limiting

- Public endpoints: Rate limited to 100 requests per 15 minutes
- Authenticated endpoints: Rate limited to 1000 requests per 15 minutes
- Admin endpoints: Rate limited to 500 requests per 15 minutes

## CORS Configuration

- Allowed origins: Production domain
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization

## Caching Strategy

- Public content: 1 hour ISR (Incremental Static Revalidation)
- User-specific data: No cache (revalidate per request)
- Admin data: 5 minute cache with manual revalidation
- Search results: 15 minute cache

## Best Practices

1. **Always check success flag** before using response data
2. **Include error messages** in UI for user feedback
3. **Use pagination** for large datasets (default: 10 per page)
4. **Validate input** on client before sending to server
5. **Handle timeouts** for long-running operations
6. **Log errors** for debugging and monitoring
