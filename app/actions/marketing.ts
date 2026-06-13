'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Get all published programs with filtering and pagination
 */
export async function getPublishedPrograms(filters?: {
  category?: string
  level?: string
  mode?: string
  search?: string
  page?: number
  limit?: number
}) {
  try {
    const supabase = await createClient()
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const offset = (page - 1) * limit

    let query = supabase
      .from('programs')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.level) {
      query = query.eq('level', filters.level)
    }

    if (filters?.mode) {
      query = query.eq('mode', filters.mode)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`)
    }

    const { data, count, error } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[marketing/getPrograms] Error:', error)
      return { success: false, error: error.message, programs: [], total: 0 }
    }

    return {
      success: true,
      programs: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error('[marketing/getPrograms] Error:', error)
    return { success: false, error: 'Failed to fetch programs', programs: [], total: 0 }
  }
}

/**
 * Get a single program by slug
 */
export async function getProgramBySlug(slug: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      return { success: false, error: 'Program not found', program: null }
    }

    return { success: true, program: data }
  } catch (error) {
    console.error('[marketing/getProgramBySlug] Error:', error)
    return { success: false, error: 'Failed to fetch program', program: null }
  }
}

/**
 * Get featured programs (for homepage)
 */
export async function getFeaturedPrograms(limit = 6) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('is_published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[marketing/getFeaturedPrograms] Error:', error)
      return { success: false, error: error.message, programs: [] }
    }

    return { success: true, programs: data || [] }
  } catch (error) {
    console.error('[marketing/getFeaturedPrograms] Error:', error)
    return { success: false, error: 'Failed to fetch featured programs', programs: [] }
  }
}

/**
 * Get all published news articles
 */
export async function getPublishedNews(filters?: {
  category?: string
  page?: number
  limit?: number
}) {
  try {
    const supabase = await createClient()
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const offset = (page - 1) * limit

    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    const { data, count, error } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[marketing/getNews] Error:', error)
      return { success: false, error: error.message, articles: [], total: 0 }
    }

    return {
      success: true,
      articles: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error('[marketing/getNews] Error:', error)
    return { success: false, error: 'Failed to fetch news', articles: [], total: 0 }
  }
}

/**
 * Get a single news article by slug
 */
export async function getNewsBySlug(slug: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      return { success: false, error: 'Article not found', article: null }
    }

    return { success: true, article: data }
  } catch (error) {
    console.error('[marketing/getNewsBySlug] Error:', error)
    return { success: false, error: 'Failed to fetch article', article: null }
  }
}

/**
 * Get featured news articles (for homepage)
 */
export async function getFeaturedNews(limit = 3) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[marketing/getFeaturedNews] Error:', error)
      return { success: false, error: error.message, articles: [] }
    }

    return { success: true, articles: data || [] }
  } catch (error) {
    console.error('[marketing/getFeaturedNews] Error:', error)
    return { success: false, error: 'Failed to fetch featured news', articles: [] }
  }
}

/**
 * Get all published events
 */
export async function getPublishedEvents(filters?: {
  page?: number
  limit?: number
  futureOnly?: boolean
}) {
  try {
    const supabase = await createClient()
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const offset = (page - 1) * limit

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (filters?.futureOnly) {
      const now = new Date().toISOString()
      query = query.gte('date', now)
    }

    const { data, count, error } = await query
      .order('date', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[marketing/getEvents] Error:', error)
      return { success: false, error: error.message, events: [], total: 0 }
    }

    return {
      success: true,
      events: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error('[marketing/getEvents] Error:', error)
    return { success: false, error: 'Failed to fetch events', events: [], total: 0 }
  }
}

/**
 * Get upcoming events (for homepage)
 */
export async function getUpcomingEvents(limit = 3) {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('date', now)
      .order('date', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('[marketing/getUpcomingEvents] Error:', error)
      return { success: false, error: error.message, events: [] }
    }

    return { success: true, events: data || [] }
  } catch (error) {
    console.error('[marketing/getUpcomingEvents] Error:', error)
    return { success: false, error: 'Failed to fetch upcoming events', events: [] }
  }
}

/**
 * Get all published research projects
 */
export async function getPublishedResearch(filters?: {
  page?: number
  limit?: number
}) {
  try {
    const supabase = await createClient()
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const offset = (page - 1) * limit

    const { data, count, error } = await supabase
      .from('research_projects')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[marketing/getResearch] Error:', error)
      return { success: false, error: error.message, projects: [], total: 0 }
    }

    return {
      success: true,
      projects: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error('[marketing/getResearch] Error:', error)
    return { success: false, error: 'Failed to fetch research projects', projects: [], total: 0 }
  }
}

/**
 * Get all partners
 */
export async function getPartners() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[marketing/getPartners] Error:', error)
      return { success: false, error: error.message, partners: [] }
    }

    return { success: true, partners: data || [] }
  } catch (error) {
    console.error('[marketing/getPartners] Error:', error)
    return { success: false, error: 'Failed to fetch partners', partners: [] }
  }
}

/**
 * Get platform statistics (for homepage/about page)
 */
export async function getPlatformStats() {
  try {
    const supabase = await createClient()

    const [
      { count: studentCount },
      { count: programCount },
      { count: enrollmentCount },
      { count: partnerCount },
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
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed'),
      supabase
        .from('partners')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
    ])

    return {
      success: true,
      stats: {
        students: studentCount || 0,
        programs: programCount || 0,
        completedEnrollments: enrollmentCount || 0,
        partners: partnerCount || 0,
      },
    }
  } catch (error) {
    console.error('[marketing/getPlatformStats] Error:', error)
    return {
      success: false,
      error: 'Failed to fetch statistics',
      stats: { students: 0, programs: 0, completedEnrollments: 0, partners: 0 },
    }
  }
}
