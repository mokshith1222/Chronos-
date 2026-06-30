import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { calendarEventUpdateSchema } from "@/lib/validations/calendar"
import { z } from "zod"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const event = await db.calendarEvent.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("[CALENDAR_EVENT_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = calendarEventUpdateSchema.parse(body)

    const updateData: any = { ...parsed }
    if (parsed.startTime) updateData.startTime = new Date(parsed.startTime)
    if (parsed.endTime) updateData.endTime = new Date(parsed.endTime)

    // Ensure start time is before end time if both are updated or retrieved
    if (updateData.startTime || updateData.endTime) {
      const existing = await db.calendarEvent.findUnique({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      const start = updateData.startTime || new Date(existing.startTime)
      const end = updateData.endTime || new Date(existing.endTime)
      if (start >= end) {
        return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 })
      }
    }

    const event = await db.calendarEvent.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("[CALENDAR_EVENT_PATCH]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const event = await db.calendarEvent.findUnique({ where: { id } })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    await db.calendarEvent.delete({
      where: { id }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        workspaceId: event.workspaceId,
        action: `Deleted calendar event "${event.title}"`,
        entityType: "EVENT",
        entityId: event.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CALENDAR_EVENT_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
