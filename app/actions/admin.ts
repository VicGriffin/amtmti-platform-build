'use server'

import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  createProgramSchema,
  updateProgramSchema,
  createNewsSchema,
  updateNewsSchema,
  createEventSchema,
  updateEventSchema,
  createResearchProjectSchema,
  updateResearchProjectSchema,
  type CreateProgram,
  type UpdateProgram,
  type CreateNews,
  type UpdateNews,
  type CreateEvent,
  type UpdateEvent,
  type CreateResearchProject,
  type UpdateResearchProject,
} from '@/lib/validation/schemas'

// ============================================================================
// PROGRAMS
// ============================================================================

export async function createProgram(formData: unknown) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = createProgramSchema.parse(formData)
    const supabase = await createClient()

    const { data: user } = await supabase.auth.getUser()

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const { data: program, error } = await supabase
      .from('programs')
      .insert({
        title: data.title,
        slug,
        category: data.category,
        category_label: data.categoryLabel,
        level: data.level,
        mode: data.mode,
        duration: data.duration,
        fees_ksh: data.feesKsh,
        summary: data.summary,
        description: data.description,
        outcomes: data.outcomes,
        featured: data.featured,
        thumbnail_url: data.thumbnailUrl,
        created_by: user?.id,
        is_published: true,
      })
      .select()
      .single()

    if (error || !program) {
      return { success: false, error: 'Failed to create program' }
    }

    return {
      success: true,
      programId: program.id,
      message: 'Program created successfully',
    }
  } catch (error) {
    console.error('[admin] Create program error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create program',
    }
  }
}

export async function updateProgram(programId: string, formData: unknown) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = updateProgramSchema.parse(formData)
    const supabase = await createClient()

    const { error } = await supabase
      .from('programs')
      .update(data)
      .eq('id', programId)

    if (error) {
      return { success: false, error: 'Failed to update program' }
    }

    return {
      success: true,
      message: 'Program updated successfully',
    }
  } catch (error) {
    console.error('[admin] Update program error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update program',
    }
  }
}

export async function deleteProgram(programId: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', programId)

    if (error) {
      return { success: false, error: 'Failed to delete program' }
    }

    return {
      success: true,
      message: 'Program deleted successfully',
    }
  } catch (error) {
    console.error('[admin] Delete program error:', error)
    return {
      success: false,
      error: 'Failed to delete program',
    }
  }
}

// ============================================================================
// NEWS
// ============================================================================

export async function createNews(formData: unknown) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = createNewsSchema.parse(formData)
    const supabase = await createClient()

    const { data: user } = await supabase.auth.getUser()

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const { data: news, error } = await supabase
      .from('news')
      .insert({
        title: data.title,
        slug,
        category: data.category,
        excerpt: data.excerpt,
        body: data.body,
        author: data.author,
        read_minutes: data.readMinutes,
        featured: data.featured,
        image_url: data.imageUrl,
        created_by: user?.id,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !news) {
      return { success: false, error: 'Failed to create news' }
    }

    return {
      success: true,
      newsId: news.id,
      message: 'News created successfully',
    }
  } catch (error) {
    console.error('[admin] Create news error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create news',
    }
  }
}

export async function updateNews(newsId: string, formData: unknown) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = updateNewsSchema.parse(formData)
    const supabase = await createClient()

    const { error } = await supabase
      .from('news')
      .update(data)
      .eq('id', newsId)

    if (error) {
      return { success: false, error: 'Failed to update news' }
    }

    return {
      success: true,
      message: 'News updated successfully',
    }
  } catch (error) {
    console.error('[admin] Update news error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update news',
    }
  }
}

export async function deleteNews(newsId: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', newsId)

    if (error) {
      return { success: false, error: 'Failed to delete news' }
    }

    return {
      success: true,
      message: 'News deleted successfully',
    }
  } catch (error) {
    console.error('[admin] Delete news error:', error)
    return {
      success: false,
      error: 'Failed to delete news',
    }
  }
}

// ============================================================================
// EVENTS
// ============================================================================

export async function createEvent(formData: unknown) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = createEventSchema.parse(formData)
    const supabase = await createClient()

    const { data: user } = await supabase.auth.getUser()

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title: data.title,
        slug,
        date: data.date,
        location: data.location,
        mode: data.mode,
        description: data.description,
        image_url: data.imageUrl,
        registration_url: data.registrationUrl,
        created_by: user?.id,
        is_published: true,
      })
      .select()
      .single()

    if (error || !event) {
      return { success: false, error: 'Failed to create event' }
    }

    return {
      success: true,
      eventId: event.id,
      message: 'Event created successfully',
    }
  } catch (error) {
    console.error('[admin] Create event error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event',
    }
  }
}

export async function updateEvent(eventId: string, formData: unknown) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = updateEventSchema.parse(formData)
    const supabase = await createClient()

    const { error } = await supabase
      .from('events')
      .update(data)
      .eq('id', eventId)

    if (error) {
      return { success: false, error: 'Failed to update event' }
    }

    return {
      success: true,
      message: 'Event updated successfully',
    }
  } catch (error) {
    console.error('[admin] Update event error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event',
    }
  }
}

export async function deleteEvent(eventId: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      return { success: false, error: 'Failed to delete event' }
    }

    return {
      success: true,
      message: 'Event deleted successfully',
    }
  } catch (error) {
    console.error('[admin] Delete event error:', error)
    return {
      success: false,
      error: 'Failed to delete event',
    }
  }
}

// ============================================================================
// ENROLLMENTS
// ============================================================================

export async function approveEnrollment(enrollmentId: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('enrollments')
      .update({ status: 'active' })
      .eq('id', enrollmentId)

    if (error) {
      return { success: false, error: 'Failed to approve enrollment' }
    }

    // Create notification for student
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('id', enrollmentId)
      .single()

    if (enrollment) {
      await supabase.from('notifications').insert({
        user_id: enrollment.student_id,
        title: 'Enrollment Approved',
        message: 'Your enrollment has been approved. You can now access the course materials.',
        type: 'enrollment',
        related_id: enrollmentId,
      })
    }

    return {
      success: true,
      message: 'Enrollment approved',
    }
  } catch (error) {
    console.error('[admin] Approve enrollment error:', error)
    return {
      success: false,
      error: 'Failed to approve enrollment',
    }
  }
}

export async function rejectEnrollment(enrollmentId: string, reason: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('enrollments')
      .update({ status: 'cancelled' })
      .eq('id', enrollmentId)

    if (error) {
      return { success: false, error: 'Failed to reject enrollment' }
    }

    // Create notification for student
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('id', enrollmentId)
      .single()

    if (enrollment) {
      await supabase.from('notifications').insert({
        user_id: enrollment.student_id,
        title: 'Enrollment Not Approved',
        message: `Your enrollment could not be approved at this time. ${reason || 'Please contact support for more information.'}`,
        type: 'enrollment',
        related_id: enrollmentId,
      })
    }

    return {
      success: true,
      message: 'Enrollment rejected',
    }
  } catch (error) {
    console.error('[admin] Reject enrollment error:', error)
    return {
      success: false,
      error: 'Failed to reject enrollment',
    }
  }
}

// ============================================================================
// APPLICATIONS
// ============================================================================

export async function approveMembershipApplication(applicationId: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('membership_applications')
      .update({
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      return { success: false, error: 'Failed to approve application' }
    }

    return {
      success: true,
      message: 'Application approved',
    }
  } catch (error) {
    console.error('[admin] Approve application error:', error)
    return {
      success: false,
      error: 'Failed to approve application',
    }
  }
}

export async function rejectMembershipApplication(applicationId: string, notes: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('membership_applications')
      .update({
        status: 'rejected',
        notes,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      return { success: false, error: 'Failed to reject application' }
    }

    return {
      success: true,
      message: 'Application rejected',
    }
  } catch (error) {
    console.error('[admin] Reject application error:', error)
    return {
      success: false,
      error: 'Failed to reject application',
    }
  }
}
