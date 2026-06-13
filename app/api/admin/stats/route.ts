import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get statistics
    const [
      { count: studentCount },
      { count: programCount },
      { count: enrollmentCount },
      { count: applicationCount },
      { count: messageCount },
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'student'),
      supabase
        .from('programs')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('membership_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new'),
    ])

    // Get enrollment status breakdown
    const { data: enrollmentStats } = await supabase
      .from('enrollments')
      .select('status')

    const statusBreakdown = {
      pending: enrollmentStats?.filter((e) => e.status === 'pending').length || 0,
      active: enrollmentStats?.filter((e) => e.status === 'active').length || 0,
      completed: enrollmentStats?.filter((e) => e.status === 'completed').length || 0,
      cancelled: enrollmentStats?.filter((e) => e.status === 'cancelled').length || 0,
    }

    // Get revenue (from pending and completed payments)
    const { data: payments } = await supabase
      .from('payments')
      .select('amount_ksh,status')

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount_ksh || 0), 0) || 0
    const pendingPayments = payments?.filter((p) => p.status === 'pending').length || 0

    return NextResponse.json(
      {
        success: true,
        stats: {
          students: studentCount || 0,
          programs: programCount || 0,
          enrollments: enrollmentCount || 0,
          pendingApplications: applicationCount || 0,
          newMessages: messageCount || 0,
          enrollmentStatus: statusBreakdown,
          revenue: {
            total: totalRevenue,
            pendingPayments,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[api/admin/stats] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
