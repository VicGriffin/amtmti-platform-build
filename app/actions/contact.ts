'use server'

import { createClient } from '@/lib/supabase/server'
import {
  contactFormSchema,
  newsletterSchema,
  membershipApplicationSchema,
  type ContactForm,
  type Newsletter,
  type MembershipApplication,
} from '@/lib/validation/schemas'

/**
 * Submit contact form
 */
export async function submitContactForm(formData: unknown) {
  try {
    const data = contactFormSchema.parse(formData)
    const supabase = await createClient()

    const { error } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      inquiry_type: data.inquiryType,
      message: data.message,
      status: 'new',
    })

    if (error) {
      return {
        success: false,
        error: 'Failed to submit message',
      }
    }

    return {
      success: true,
      message: 'Thank you for your message. We will get back to you soon.',
    }
  } catch (error) {
    console.error('[contact] Submit form error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form',
    }
  }
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(formData: unknown) {
  try {
    const data = newsletterSchema.parse(formData)
    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_emails')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existing) {
      // Reactivate if unsubscribed
      if (!existing.subscribed) {
        await supabase
          .from('newsletter_emails')
          .update({
            subscribed: true,
            unsubscribed_at: null,
          })
          .eq('email', data.email)
      }
    } else {
      // Insert new
      const { error } = await supabase.from('newsletter_emails').insert({
        email: data.email,
        subscribed: true,
      })

      if (error) {
        return {
          success: false,
          error: 'Failed to subscribe',
        }
      }
    }

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    }
  } catch (error) {
    console.error('[contact] Newsletter subscription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Subscription failed',
    }
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('newsletter_emails')
      .update({
        subscribed: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)

    if (error) {
      return {
        success: false,
        error: 'Failed to unsubscribe',
      }
    }

    return {
      success: true,
      message: 'Successfully unsubscribed',
    }
  } catch (error) {
    console.error('[contact] Newsletter unsubscribe error:', error)
    return {
      success: false,
      error: 'Unsubscribe failed',
    }
  }
}

/**
 * Submit membership application
 */
export async function submitMembershipApplication(formData: unknown) {
  try {
    const data = membershipApplicationSchema.parse(formData)
    const supabase = await createClient()

    // Check if already applied
    const { data: existing } = await supabase
      .from('membership_applications')
      .select('id')
      .eq('email', data.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing) {
      const createdAt = new Date(existing.created_at)
      const now = new Date()
      const daysSinceApplication = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

      // Allow reapplication after 30 days
      if (daysSinceApplication < 30) {
        return {
          success: false,
          error: 'You already have a pending application. Please wait 30 days to reapply.',
        }
      }
    }

    const { error } = await supabase.from('membership_applications').insert({
      full_name: data.fullName,
      email: data.email,
      country: data.country,
      profession: data.profession,
      membership_tier: data.membershipTier,
      reason_for_joining: data.reasonForJoining,
      status: 'pending',
    })

    if (error) {
      return {
        success: false,
        error: 'Failed to submit application',
      }
    }

    return {
      success: true,
      message: 'Application submitted successfully. We will review your application and get back to you soon.',
    }
  } catch (error) {
    console.error('[contact] Membership application error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Application failed',
    }
  }
}

/**
 * Get membership application status
 */
export async function getMembershipApplicationStatus(email: string) {
  try {
    const supabase = await createClient()

    const { data: applications, error } = await supabase
      .from('membership_applications')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) {
      return {
        success: false,
        error: 'Failed to fetch application status',
        applications: [],
      }
    }

    return {
      success: true,
      applications: applications || [],
    }
  } catch (error) {
    console.error('[contact] Get application status error:', error)
    return {
      success: false,
      error: 'Failed to fetch application',
      applications: [],
    }
  }
}
