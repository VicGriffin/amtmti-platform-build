// Shared admin token signing/verification using the Web Crypto API so it works
// in BOTH the edge runtime (middleware/proxy) and the Node.js runtime (server
// actions). Avoid importing Node's 'crypto' module, which is unavailable on edge.

const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

export const ADMIN_COOKIE_NAME = 'amtmti_admin'
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS

function getSecret() {
  return (
    process.env.SUPABASE_JWT_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'amtmti-dev-admin-secret'
  )
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sign(value: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(value))
  return toHex(signature)
}

export async function makeAdminToken(): Promise<string> {
  const issued = Date.now().toString()
  return `${issued}.${await sign(issued)}`
}

export async function verifyAdminToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false
  const [issued, sig] = token.split('.')
  if (!issued || !sig) return false
  if ((await sign(issued)) !== sig) return false
  const age = Date.now() - Number(issued)
  return age >= 0 && age <= MAX_AGE_SECONDS * 1000
}
