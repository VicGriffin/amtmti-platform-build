'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/portal'

/**
 * Get student's enrollments with full details
 */
export async function getStudentEnrollments() {
  try {
    const { supabase, user } = await requireUser()

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        programs(
          id,
          title,
          slug,
          category,
          category_label,
          level,
          duration,
          fees_ksh,
          thumbnail_url
        ),
        payments(
          id,
          status,
          amount_ksh,
          method
        )
      `)
      .eq('student_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (error) {
      console.error('[portal/getEnrollments] Error:', error)
      return { success: false, error: error.message, enrollments: [] }
    }

    return { success: true, enrollments: data || [] }
  } catch (error) {
    console.error('[portal/getEnrollments] Error:', error)
    return { success: false, error: 'Failed to fetch enrollments', enrollments: [] }
  }
}

/**
 * Get enrollment progress details
 */
export async function getEnrollmentProgress(enrollmentId: string) {
  try {
    const { supabase, user } = await requireUser()

    const { data: enrollment, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        *,
        programs(
          id,
          title,
          description,
          outcomes
        )
      `)
      .eq('id', enrollmentId)
      .eq('student_id', user.id)
      .single()

    if (enrollError || !enrollment) {
      return { success: false, error: 'Enrollment not found', enrollment: null }
    }

    // Get completed lessons
    const { data: completedLessons, error: lessonsError } = await supabase
      .from('enrollment_lessons')
      .select('lesson_id, completed_at')
      .eq('enrollment_id', enrollmentId)
      .not('completed_at', 'is', null)

    if (lessonsError) {
      console.error('[portal/getProgress] Lessons error:', lessonsError)
    }

    return {
      success: true,
      enrollment,
      completedLessons: completedLessons || [],
    }
  } catch (error) {
    console.error('[portal/getProgress] Error:', error)
    return { success: false, error: 'Failed to fetch progress', enrollment: null, completedLessons: [] }
  }
}

/**
 * Mark a lesson as complete
 */
export async function completeLessonAction(enrollmentId: string, lessonId: string) {
  try {
    const { supabase, user } = await requireUser()

    // Verify enrollment belongs to user
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('id', enrollmentId)
      .eq('student_id', user.id)
      .single()

    if (!enrollment) {
      return { success: false, error: 'Enrollment not found' }
    }

    // Upsert lesson completion
    const { error } = await supabase
      .from('enrollment_lessons')
      .upsert(
        {
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: 'enrollment_id,lesson_id',
        }
      )

    if (error) {
      return { success: false, error: 'Failed to mark lesson complete' }
    }

    // Revalidate progress page
    revalidatePath(`/portal/courses/${enrollmentId}`)

    return { success: true, message: 'Lesson marked as complete' }
  } catch (error) {
    console.error('[portal/completeLessonAction] Error:', error)
    return { success: false, error: 'Failed to update lesson' }
  }
}

/**
 * Update student profile
 */
export async function updateProfileAction(formData: FormData) {
  try {
    const { supabase, user } = await requireUser()

    const updates = {
      full_name: String(formData.get('fullName') || ''),
      phone: String(formData.get('phone') || ''),
      country: String(formData.get('country') || ''),
      profession: String(formData.get('profession') || ''),
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      return { success: false, error: 'Failed to update profile' }
    }

    revalidatePath('/portal/profile')
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('[portal/updateProfile] Error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

/**
 * Get student certificates
 */
export async function getStudentCertificates() {
  try {
    const { supabase, user } = await requireUser()

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        enrollments(
          id,
          programs(title)
        )
      `)
      .eq('student_id', user.id)
      .order('issued_at', { ascending: false })

    if (error) {
      console.error('[portal/getCertificates] Error:', error)
      return { success: false, error: error.message, certificates: [] }
    }

    return { success: true, certificates: data || [] }
  } catch (error) {
    console.error('[portal/getCertificates] Error:', error)
    return { success: false, error: 'Failed to fetch certificates', certificates: [] }
  }
}

/**
 * Get student notifications
 */
export async function getStudentNotifications() {
  try {
    const { supabase, user } = await requireUser()

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('[portal/getNotifications] Error:', error)
      return { success: false, error: error.message, notifications: [] }
    }

    return { success: true, notifications: data || [] }
  } catch (error) {
    console.error('[portal/getNotifications] Error:', error)
    return { success: false, error: 'Failed to fetch notifications', notifications: [] }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationReadAction(notificationId: string) {
  try {
    const { supabase, user } = await requireUser()

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: 'Failed to update notification' }
    }

    revalidatePath('/portal/notifications')
    return { success: true }
  } catch (error) {
    console.error('[portal/markNotificationRead] Error:', error)
    return { success: false, error: 'Failed to update notification' }
  }
}
