import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Query parameters
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const mode = searchParams.get('mode')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('programs')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (level) {
      query = query.eq('level', level)
    }

    if (mode) {
      query = query.eq('mode', mode)
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,summary.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    // Pagination
    const { data, count, error } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
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
    console.error('[api/programs] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    // Generate slug
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('programs')
      .insert({
        ...body,
        slug,
        created_by: user?.id,
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('[api/programs] POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
