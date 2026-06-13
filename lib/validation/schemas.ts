import { z } from 'zod'

// Auth schemas
export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number'),
  country: z.string().min(2, 'Please select a country'),
  profession: z.string().min(2, 'Please select a profession'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile schemas
export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
})

// Program schemas
export const createProgramSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  category: z.string().min(2, 'Please select a category'),
  categoryLabel: z.string().min(2),
  level: z.enum(['Certificate', 'Diploma', 'Postgraduate Diploma', 'CPD Course']),
  mode: z.enum(['Online', 'Hybrid', 'In-Person']),
  duration: z.string().min(1, 'Duration is required'),
  feesKsh: z.number().min(0, 'Fees must be a positive number'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500),
  outcomes: z.array(z.string().min(5)).min(1, 'At least one outcome is required'),
  description: z.string().min(20, 'Description must be at least 20 characters').optional(),
  featured: z.boolean().default(false),
  thumbnailUrl: z.string().url().optional(),
})

export const updateProgramSchema = createProgramSchema.partial()

// Enrollment schemas
export const enrollSchema = z.object({
  programId: z.string().uuid('Invalid program ID'),
  paymentMethod: z.enum(['mpesa', 'bank_transfer']),
})

// News schemas
export const createNewsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  category: z.enum(['News', 'Research Updates', 'Partnerships', 'Announcements', 'Events']),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(300),
  body: z.string().min(100, 'Body must be at least 100 characters'),
  author: z.string().min(2, 'Author name is required'),
  readMinutes: z.number().min(1, 'Read time must be at least 1 minute'),
  featured: z.boolean().default(false),
  imageUrl: z.string().url().optional(),
})

export const updateNewsSchema = createNewsSchema.partial()

// Event schemas
export const createEventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  date: z.string().refine((date) => new Date(date) > new Date(), 'Event date must be in the future'),
  location: z.string().min(2, 'Location is required').max(300),
  mode: z.enum(['In-Person', 'Virtual', 'Hybrid']),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  imageUrl: z.string().url().optional(),
  registrationUrl: z.string().url().optional(),
})

export const updateEventSchema = createEventSchema.partial()

// Membership application schemas
export const membershipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  country: z.string().min(2, 'Country is required'),
  profession: z.string().min(2, 'Profession is required'),
  membershipTier: z.enum(['Student', 'Affiliate', 'Corporate']),
  reasonForJoining: z.string().min(10, 'Please tell us why you\'re interested').max(500),
})

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  inquiryType: z.enum(['General', 'Admissions', 'Research', 'Partnerships', 'Jobs', 'Other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

// Newsletter schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Research schemas
export const createResearchProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  status: z.enum(['Active', 'Completed', 'Planned']),
  principalInvestigator: z.string().min(2, 'PI name is required'),
  countries: z.array(z.string()).min(1, 'Select at least one country'),
  startDate: z.string(),
  endDate: z.string().optional(),
})

export const updateResearchProjectSchema = createResearchProjectSchema.partial()

// Admin-only schemas
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Types
export type Registration = z.infer<typeof registrationSchema>
export type Login = z.infer<typeof loginSchema>
export type UpdateProfile = z.infer<typeof updateProfileSchema>
export type CreateProgram = z.infer<typeof createProgramSchema>
export type UpdateProgram = z.infer<typeof updateProgramSchema>
export type Enroll = z.infer<typeof enrollSchema>
export type CreateNews = z.infer<typeof createNewsSchema>
export type UpdateNews = z.infer<typeof updateNewsSchema>
export type CreateEvent = z.infer<typeof createEventSchema>
export type UpdateEvent = z.infer<typeof updateEventSchema>
export type MembershipApplication = z.infer<typeof membershipApplicationSchema>
export type ContactForm = z.infer<typeof contactFormSchema>
export type Newsletter = z.infer<typeof newsletterSchema>
export type CreateResearchProject = z.infer<typeof createResearchProjectSchema>
export type UpdateResearchProject = z.infer<typeof updateResearchProjectSchema>
