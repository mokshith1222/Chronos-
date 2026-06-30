import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { calendarEventSchema } from "@/lib/validations/calendar"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    const type = searchParams.get("type") || undefined

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const whereClause: any = {
      workspaceId,
    }

    if (type) {
      whereClause.type = type
    }

    // Date range filter
    if (start && end) {
      whereClause.startTime = {
        gte: new Date(start),
      }
      whereClause.endTime = {
        lte: new Date(end),
      }
    }

    const events = await db.calendarEvent.findMany({
      where: whereClause,
      orderBy: {
        startTime: "asc",
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("[CALENDAR_EVENTS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const body = await req.json()

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const parsed = calendarEventSchema.parse(body)

    // Ensure start time is before end time
    const start = new Date(parsed.startTime)
    const end = new Date(parsed.endTime)
    if (start >= end) {
      return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 })
    }

    const event = await db.calendarEvent.create({
      data: {
        workspaceId,
        title: parsed.title,
        description: parsed.description,
        startTime: start,
        endTime: end,
        location: parsed.location,
        color: parsed.color,
        isAllDay: parsed.isAllDay,
        type: parsed.type,
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        workspaceId,
        action: `Created calendar event "${event.title}"`,
        entityType: "EVENT",
        entityId: event.id,
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[CALENDAR_EVENTS_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
