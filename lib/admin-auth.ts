import { cookies } from 'next/headers'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
  makeAdminToken,
  verifyAdminToken,
} from '@/lib/admin-token'

// Admin authentication uses fixed credentials stored in environment variables
// (ADMIN_EMAIL / ADMIN_PASSWORD). A signed cookie marks an authenticated admin
// session, independent of Supabase Auth (which is used for students).

export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) return false
  return (
    email.trim().toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword
  )
}

export async function createAdminSession() {
  const store = await cookies()
  store.set(ADMIN_COOKIE_NAME, await makeAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
}

export async function destroyAdminSession() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE_NAME)
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return verifyAdminToken(store.get(ADMIN_COOKIE_NAME)?.value)
}
