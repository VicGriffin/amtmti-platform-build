'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, type Registration, type Login } from '@/lib/validation/schemas'

/**
 * Register a new student
 */
export async function registerStudent(formData: unknown) {
  try {
    const data = registrationSchema.parse(formData)
    const supabase = await createClient()

    // Sign up with Supabase
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          country: data.country,
          profession: data.profession,
          phone: data.phone,
        },
      },
    })

    if (signUpError) {
      return {
        success: false,
        error: signUpError.message || 'Failed to create account',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create account. Please try again.',
      }
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        country: data.country,
        profession: data.profession,
        role: 'student',
      })

    if (profileError) {
      console.error('[auth] Profile creation error:', profileError)
      return {
        success: false,
        error: 'Account created but profile setup failed. Please contact support.',
      }
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    }
  } catch (error) {
    console.error('[auth] Registration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed. Please try again.',
    }
  }
}

/**
 * Login student
 */
export async function loginStudent(formData: unknown) {
  try {
    const data = loginSchema.parse(formData)
    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error || !authData.user) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    return {
      success: true,
      message: 'Login successful',
    }
  } catch (error) {
    console.error('[auth] Login error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

/**
 * Logout student
 */
export async function logoutStudent() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  } catch (error) {
    console.error('[auth] Logout error:', error)
    return {
      success: false,
      error: 'Logout failed',
    }
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(formData: unknown) {
  try {
    const data = forgotPasswordSchema.parse(formData)
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) {
      // Don't reveal if email exists
      return {
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      }
    }

    return {
      success: true,
      message: 'Password reset link sent. Check your email.',
    }
  } catch (error) {
    console.error('[auth] Password reset request error:', error)
    return {
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    }
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  formData: unknown,
) {
  try {
    const data = resetPasswordSchema.parse(formData)
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      }
    }

    return {
      success: true,
      message: 'Password reset successful. You can now log in.',
    }
  } catch (error) {
    console.error('[auth] Password reset error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password reset failed',
    }
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email,
      ...profile,
    }
  } catch (error) {
    console.error('[auth] Get current user error:', error)
    return null
  }
}
