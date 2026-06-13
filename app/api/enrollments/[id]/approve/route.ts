import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('enrollments')
      .update({ status: 'active' })
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to approve enrollment' },
        { status: 400 }
      )
    }

    // Get enrollment details for notification
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('id', id)
      .single()

    if (enrollment) {
      await supabase.from('notifications').insert({
        user_id: enrollment.student_id,
        title: 'Enrollment Approved',
        message: 'Your enrollment has been approved. You can now access the course materials.',
        type: 'enrollment',
        related_id: id,
      })
    }

    return NextResponse.json(
      { success: true, message: 'Enrollment approved' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[api/enrollments/[id]/approve] POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
