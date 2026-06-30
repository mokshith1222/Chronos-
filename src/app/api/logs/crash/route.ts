import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, stack, componentStack } = body

    logger.error(`[CLIENT_CRASH] ${message}`, {
      stack,
      componentStack,
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1"
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to log crash" }, { status: 500 })
  }
}
