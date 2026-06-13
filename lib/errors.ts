/**
 * Custom error classes for the AMTMTI platform
 */

export class AMTMTIError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    context?: Record<string, any>
  ) {
    super(message)
    this.name = "AMTMTIError"
    this.statusCode = statusCode
    this.code = code
    this.context = context

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class ValidationError extends AMTMTIError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, "VALIDATION_ERROR", context)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends AMTMTIError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`
    super(message, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends AMTMTIError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AMTMTIError {
  constructor(message: string = "Access forbidden") {
    super(message, 403, "FORBIDDEN")
    this.name = "ForbiddenError"
  }
}

export class ConflictError extends AMTMTIError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 409, "CONFLICT", context)
    this.name = "ConflictError"
  }
}

export class DatabaseError extends AMTMTIError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 500, "DATABASE_ERROR", context)
    this.name = "DatabaseError"
  }
}

export class RateLimitError extends AMTMTIError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT")
    this.name = "RateLimitError"
  }
}

/**
 * Handle errors consistently across the application
 */
export function handleError(error: unknown) {
  console.error("[AMTMTI Error]", error)

  if (error instanceof AMTMTIError) {
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      context: error.context,
    }
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      code: "INTERNAL_ERROR",
      message: error.message,
    }
  }

  return {
    statusCode: 500,
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
  }
}
