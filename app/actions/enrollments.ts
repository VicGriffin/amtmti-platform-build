'use server'

import { createClient } from '@/lib/supabase/server'
import { enrollSchema, type Enroll } from '@/lib/validation/schemas'

/**
 * Enroll student in a program
 */
export async function enrollInProgram(formData: unknown) {
  try {
    const data = enrollSchema.parse(formData)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to enroll',
      }
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('program_id', data.programId)
      .single()

    if (existing) {
      return {
        success: false,
        error: 'You are already enrolled in this program',
      }
    }

    // Get program details
    const { data: program } = await supabase
      .from('programs')
      .select('fees_ksh')
      .eq('id', data.programId)
      .single()

    if (!program) {
      return {
        success: false,
        error: 'Program not found',
      }
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        student_id: user.id,
        program_id: data.programId,
        status: 'pending',
      })
      .select()
      .single()

    if (enrollmentError || !enrollment) {
      return {
        success: false,
        error: 'Failed to create enrollment',
      }
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        enrollment_id: enrollment.id,
        amount_ksh: program.fees_ksh,
        method: data.paymentMethod,
        status: 'pending',
      })

    if (paymentError) {
      console.error('[enrollments] Payment creation error:', paymentError)
      // Enrollment was created, payment will be processed separately
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Enrollment Pending',
      message: 'Your enrollment is pending admin approval',
      type: 'enrollment',
      related_id: enrollment.id,
    })

    return {
      success: true,
      enrollmentId: enrollment.id,
      message: 'Enrollment initiated. Please complete payment.',
    }
  } catch (error) {
    console.error('[enrollments] Enrollment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Enrollment failed',
    }
  }
}

/**
 * Get student enrollments
 */
export async function getStudentEnrollments() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        enrollments: [],
      }
    }

    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(
        `
        *,
        programs (
          id,
          title,
          slug,
          category,
          category_label,
          level,
          mode,
          duration,
          fees_ksh,
          thumbnail_url
        )
      `
      )
      .eq('student_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message,
        enrollments: [],
      }
    }

    return {
      success: true,
      enrollments: enrollments || [],
    }
  } catch (error) {
    console.error('[enrollments] Get enrollments error:', error)
    return {
      success: false,
      error: 'Failed to fetch enrollments',
      enrollments: [],
    }
  }
}

/**
 * Get enrollment details
 */
export async function getEnrollmentDetails(enrollmentId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        enrollment: null,
      }
    }

    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select(
        `
        *,
        programs (
          id,
          title,
          slug,
          category,
          description,
          level,
          mode,
          duration,
          fees_ksh
        ),
        payments (
          id,
          status,
          method,
          amount_ksh
        ),
        enrollment_lessons (count)
      `
      )
      .eq('id', enrollmentId)
      .eq('student_id', user.id)
      .single()

    if (error) {
      return {
        success: false,
        error: 'Enrollment not found',
        enrollment: null,
      }
    }

    return {
      success: true,
      enrollment,
    }
  } catch (error) {
    console.error('[enrollments] Get enrollment details error:', error)
    return {
      success: false,
      error: 'Failed to fetch enrollment',
      enrollment: null,
    }
  }
}

/**
 * Mark lesson as complete
 */
export async function markLessonComplete(enrollmentId: string, lessonId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Verify enrollment belongs to user
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('id', enrollmentId)
      .eq('student_id', user.id)
      .single()

    if (!enrollment) {
      return {
        success: false,
        error: 'Enrollment not found',
      }
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
      return {
        success: false,
        error: 'Failed to mark lesson complete',
      }
    }

    // Update progress
    await updateEnrollmentProgress(enrollmentId)

    return {
      success: true,
      message: 'Lesson marked as complete',
    }
  } catch (error) {
    console.error('[enrollments] Mark lesson complete error:', error)
    return {
      success: false,
      error: 'Failed to update lesson status',
    }
  }
}

/**
 * Update enrollment progress percentage
 */
async function updateEnrollmentProgress(enrollmentId: string) {
  try {
    const supabase = await createClient()

    // Get total lessons in program
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('program_id')
      .eq('id', enrollmentId)
      .single()

    if (!enrollment) return

    const { data: courses } = await supabase
      .from('courses')
      .select('id')
      .eq('program_id', enrollment.program_id)

    let totalLessons = 0
    let completedLessons = 0

    if (courses && courses.length > 0) {
      // Count total lessons
      const { count } = await supabase
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .in('course_id', courses.map((c) => c.id))

      totalLessons = count || 0

      // Count completed lessons
      const { count: completed } = await supabase
        .from('enrollment_lessons')
        .select('id', { count: 'exact', head: true })
        .eq('enrollment_id', enrollmentId)
        .not('completed_at', 'is', null)

      completedLessons = completed || 0
    }

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    await supabase
      .from('enrollments')
      .update({
        progress_percentage: progress,
      })
      .eq('id', enrollmentId)
  } catch (error) {
    console.error('[enrollments] Update progress error:', error)
  }
}
