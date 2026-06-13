/**
 * In-memory rate limiting for the AMTMTI platform
 * For production, consider using Redis or Upstash Redis
 */

interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private cleanup() {
    const now = Date.now()
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    }
  }

  isLimited(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const key = identifier

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + config.interval,
      }
      return false
    }

    const entry = this.store[key]

    if (now > entry.resetTime) {
      // Reset if interval has passed
      entry.count = 1
      entry.resetTime = now + config.interval
      return false
    }

    entry.count++
    return entry.count > config.maxRequests
  }

  getRemainingRequests(identifier: string, config: RateLimitConfig): number {
    const entry = this.store[identifier]
    if (!entry) {
      return config.maxRequests
    }

    const now = Date.now()
    if (now > entry.resetTime) {
      return config.maxRequests
    }

    return Math.max(0, config.maxRequests - entry.count)
  }

  destroy() {
    clearInterval(this.cleanupInterval)
  }
}

// Singleton instance
let limiter: RateLimiter

function getLimiter(): RateLimiter {
  if (!limiter) {
    limiter = new RateLimiter()
  }
  return limiter
}

// Predefined configurations
export const RATE_LIMITS = {
  // Auth endpoints: 5 requests per minute per IP
  AUTH: { interval: 60000, maxRequests: 5 },

  // API endpoints: 100 requests per minute per user
  API: { interval: 60000, maxRequests: 100 },

  // Form submissions: 3 requests per hour per IP
  FORM: { interval: 3600000, maxRequests: 3 },

  // Enrollment: 5 enrollments per day per user
  ENROLL: { interval: 86400000, maxRequests: 5 },

  // Newsletter: 1 subscription per day per email
  NEWSLETTER: { interval: 86400000, maxRequests: 1 },
}

/**
 * Check if a request is rate limited
 */
export function checkRateLimit(identifier: string, limit: RateLimitConfig): boolean {
  const limiter = getLimiter()
  return limiter.isLimited(identifier, limit)
}

/**
 * Get remaining requests for identifier
 */
export function getRemainingRequests(identifier: string, limit: RateLimitConfig): number {
  const limiter = getLimiter()
  return limiter.getRemainingRequests(identifier, limit)
}

/**
 * Middleware for Next.js API routes
 */
export function withRateLimit(config: RateLimitConfig) {
  return (handler: Function) => {
    return async (req: any, res: any) => {
      // Get identifier (IP address or user ID)
      const identifier = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"

      if (checkRateLimit(identifier, config)) {
        const remaining = getRemainingRequests(identifier, config)
        res.status(429).json({
          error: "Too many requests",
          retryAfter: Math.ceil(config.interval / 1000),
          remaining,
        })
        return
      }

      return handler(req, res)
    }
  }
}
