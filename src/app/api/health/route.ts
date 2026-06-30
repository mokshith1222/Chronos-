import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET() {
  const startTime = Date.now()
  try {
    // 1. Verify database connectivity
    await db.$queryRaw`SELECT 1`

    // 2. Retrieve server metrics
    const memory = process.memoryUsage()
    const uptime = process.uptime()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memory.external / 1024 / 1024)}MB`,
      }
    })
  } catch (error: any) {
    logger.error("[HEALTH_CHECK_FAILED]", { error: error.message })
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}
