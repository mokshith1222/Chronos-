import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const manualEntrySchema = z.object({
  projectId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isProductive: z.boolean().default(true),
  type: z.enum(["NORMAL", "POMODORO", "STOPWATCH", "COUNTDOWN", "DEEP_WORK"]).default("NORMAL"),
  mood: z.number().int().min(1).max(5).optional().nullable(),
  energyLevel: z.number().int().min(1).max(5).optional().nullable(),
  productivityRating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
})

const updateEntrySchema = manualEntrySchema.partial()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const projectId = searchParams.get("projectId") || undefined
    const taskId = searchParams.get("taskId") || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const whereClause: any = {
      workspaceId,
      endTime: { not: null }, // Only fetch completed sessions
    }

    if (projectId) whereClause.projectId = projectId
    if (taskId) whereClause.taskId = taskId

    const entries = await db.timeEntry.findMany({
      where: whereClause,
      include: {
        project: true,
        task: true,
      },
      orderBy: {
        startTime: "desc",
      },
      take: limit,
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("[TIME_ENTRIES_GET]", error)
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

    const parsed = manualEntrySchema.parse(body)
    const start = new Date(parsed.startTime)
    const end = new Date(parsed.endTime)
    const duration = Math.round((end.getTime() - start.getTime()) / 1000)

    if (duration < 0) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    }

    const entry = await db.timeEntry.create({
      data: {
        workspaceId,
        projectId: parsed.projectId,
        taskId: parsed.taskId,
        description: parsed.description,
        startTime: start,
        endTime: end,
        duration,
        isProductive: parsed.isProductive,
        type: parsed.type,
        mood: parsed.mood,
        energyLevel: parsed.energyLevel,
        productivityRating: parsed.productivityRating,
        notes: parsed.notes,
        tags: parsed.tags,
      },
      include: {
        project: true,
        task: true,
      }
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("[TIME_ENTRIES_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const body = await req.json()

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const parsed = updateEntrySchema.parse(body)
    const updateData: any = { ...parsed }

    if (parsed.startTime) updateData.startTime = new Date(parsed.startTime)
    if (parsed.endTime) updateData.endTime = new Date(parsed.endTime)

    // Recalculate duration if times changed
    if (updateData.startTime || updateData.endTime) {
      const existing = await db.timeEntry.findUnique({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 })
      }
      const start = updateData.startTime || new Date(existing.startTime)
      const end = updateData.endTime || (existing.endTime ? new Date(existing.endTime) : new Date())
      const duration = Math.round((end.getTime() - start.getTime()) / 1000)
      if (duration < 0) {
        return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
      }
      updateData.duration = duration
    }

    const entry = await db.timeEntry.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        task: true,
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("[TIME_ENTRIES_PATCH]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    await db.timeEntry.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TIME_ENTRIES_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
