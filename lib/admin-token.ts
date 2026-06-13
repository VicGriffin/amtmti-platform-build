import crypto from 'crypto'

// Shared admin token signing/verification. Kept free of next/headers imports so
// it is safe to use from middleware (proxy) as well as server actions.

const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

function getSecret() {
  return (
    process.env.SUPABASE_JWT_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'amtmti-dev-admin-secret'
  )
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex')
}

export function makeAdminToken() {
  const issued = Date.now().toString()
  return `${issued}.${sign(issued)}`
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const [issued, sig] = token.split('.')
  if (!issued || !sig) return false
  if (sign(issued) !== sig) return false
  const age = Date.now() - Number(issued)
  return age >= 0 && age <= MAX_AGE_SECONDS * 1000
}

export const ADMIN_COOKIE_NAME = 'amtmti_admin'
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS
