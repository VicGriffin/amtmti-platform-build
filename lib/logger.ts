/**
 * Structured logging utility for the AMTMTI platform
 */

export type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private format(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry
    const levelUpper = level.toUpperCase()

    let output = `[${timestamp}] [${levelUpper}] ${message}`

    if (context && Object.keys(context).length > 0) {
      output += ` ${JSON.stringify(context)}`
    }

    if (error) {
      output += `\n${error.stack}`
    }

    return output
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    const formatted = this.format(entry)

    // In development, use console
    if (this.isDevelopment) {
      switch (level) {
        case "debug":
          console.debug(formatted)
          break
        case "info":
          console.info(formatted)
          break
        case "warn":
          console.warn(formatted)
          break
        case "error":
          console.error(formatted)
          break
      }
    }

    // In production, you could send to external service
    // Example: Sentry, LogRocket, DataDog, etc.
    if (!this.isDevelopment && level === "error") {
      // Send to error tracking service
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log("error", message, context, error)
  }
}

export const logger = new Logger()

/**
 * Audit logging for important operations
 */
export interface AuditLog {
  action: string
  userId: string
  resourceType: string
  resourceId: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function auditLog(entry: AuditLog) {
  logger.info(`Audit: ${entry.action}`, {
    userId: entry.userId,
    resource: `${entry.resourceType}/${entry.resourceId}`,
    ...entry,
  })

  // In production, persist to audit_logs table
  // const db = createAdminClient()
  // await db.from("audit_logs").insert({
  //   action: entry.action,
  //   user_id: entry.userId,
  //   resource_type: entry.resourceType,
  //   resource_id: entry.resourceId,
  //   changes: entry.changes,
  //   ip_address: entry.ipAddress,
  //   user_agent: entry.userAgent,
  // })
}
