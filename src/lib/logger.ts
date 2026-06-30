type LogMetadata = Record<string, any>

class Logger {
  private isProduction = process.env.NODE_ENV === "production"

  private formatMessage(level: string, message: string, meta?: LogMetadata) {
    const timestamp = new Date().toISOString()
    if (this.isProduction) {
      // Production: structured JSON logging for log aggregators
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      })
    } else {
      // Development: clean, human-readable console logging
      const metaString = meta && Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : ""
      const color = 
        level === "ERROR" ? "\x1b[31m" :
        level === "WARN" ? "\x1b[33m" :
        level === "INFO" ? "\x1b[32m" : "\x1b[37m"
      const reset = "\x1b[0m"
      return `[${timestamp}] ${color}${level}${reset}: ${message}${metaString}`
    }
  }

  info(message: string, meta?: LogMetadata) {
    console.log(this.formatMessage("INFO", message, meta))
  }

  warn(message: string, meta?: LogMetadata) {
    console.warn(this.formatMessage("WARN", message, meta))
  }

  error(message: string, meta?: LogMetadata) {
    console.error(this.formatMessage("ERROR", message, meta))
  }

  debug(message: string, meta?: LogMetadata) {
    if (!this.isProduction) {
      console.log(this.formatMessage("DEBUG", message, meta))
    }
  }
}

export const logger = new Logger()
