import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    // Get today's start
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const events = await db.calendarEvent.findMany({
      where: {
        workspaceId,
        startTime: {
          gte: today,
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5,
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("[DASHBOARD_CALENDAR_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
