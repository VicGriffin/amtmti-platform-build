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
    const { data: user } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('membership_applications')
      .update({
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to approve application' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Application approved' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[api/applications/[id]/approve] POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
