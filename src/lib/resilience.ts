import { logger } from "./logger"

interface RetryOptions {
  retries?: number
  delayMs?: number
  maxDelayMs?: number
  factor?: number
}

/**
 * Executes an asynchronous function with exponential backoff and jitter.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const retries = options.retries ?? 3
  const delayMs = options.delayMs ?? 500
  const maxDelayMs = options.maxDelayMs ?? 5000
  const factor = options.factor ?? 2

  let attempt = 0
  let currentDelay = delayMs

  while (true) {
    try {
      return await fn()
    } catch (error: any) {
      attempt++
      if (attempt > retries) {
        logger.error(`[RETRY_EXHAUSTED] Failed after ${attempt} attempts: ${error.message}`)
        throw error
      }

      // Add full jitter to prevent thundering herd problem
      const jitter = Math.random() * currentDelay
      const sleepTime = Math.min(maxDelayMs, currentDelay + jitter)

      logger.warn(`[RETRY_ATTEMPT] Attempt ${attempt} failed. Retrying in ${Math.round(sleepTime)}ms... Error: ${error.message}`)
      
      await new Promise((resolve) => setTimeout(resolve, sleepTime))

      currentDelay *= factor
    }
  }
}
