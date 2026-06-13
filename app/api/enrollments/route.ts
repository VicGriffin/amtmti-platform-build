import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Check if user is admin or getting their own enrollments
    const isAdmin = await isAdminAuthenticated()
    
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('enrollments')
      .select('*,programs(*)', { count: 'exact' })

    // If not admin, only show own enrollments
    if (!isAdmin && user) {
      query = query.eq('student_id', user.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, count, error } = await query
      .order('enrolled_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[api/enrollments] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { programId, paymentMethod } = body

    if (!programId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('program_id', programId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this program' },
        { status: 400 }
      )
    }

    // Get program details
    const { data: program } = await supabase
      .from('programs')
      .select('fees_ksh')
      .eq('id', programId)
      .single()

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        student_id: user.id,
        program_id: programId,
        status: 'pending',
      })
      .select()
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Failed to create enrollment' },
        { status: 400 }
      )
    }

    // Create payment record
    await supabase.from('payments').insert({
      enrollment_id: enrollment.id,
      amount_ksh: program.fees_ksh,
      method: paymentMethod,
      status: 'pending',
    })

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Enrollment Pending',
      message: 'Your enrollment is pending admin approval',
      type: 'enrollment',
      related_id: enrollment.id,
    })

    return NextResponse.json(
      { success: true, data: enrollment },
      { status: 201 }
    )
  } catch (error) {
    console.error('[api/enrollments] POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
