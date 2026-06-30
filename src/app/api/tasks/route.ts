import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { taskSchema } from "@/lib/validations/task"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const projectId = searchParams.get("projectId") || undefined
    const status = searchParams.get("status") || undefined
    const priority = searchParams.get("priority") || undefined
    const parentTaskId = searchParams.get("parentTaskId")
    const showArchived = searchParams.get("showArchived") === "true"

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    // Build filter query
    const whereClause: any = {
      workspaceId,
      isArchived: showArchived,
    }

    if (projectId) whereClause.projectId = projectId
    if (status) whereClause.status = status
    if (priority) whereClause.priority = priority

    // By default, if parentTaskId is not specified, we only fetch top-level tasks to prevent massive nested trees in a single list
    if (parentTaskId === "null") {
      whereClause.parentTaskId = null
    } else if (parentTaskId) {
      whereClause.parentTaskId = parentTaskId
    }

    const tasks = await db.task.findMany({
      where: whereClause,
      include: {
        project: true,
        checklists: {
          orderBy: { position: "asc" }
        },
        _count: {
          select: { subtasks: true, checklists: true }
        }
      },
      orderBy: [
        { position: "asc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("[TASKS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const parsed = taskSchema.parse(body)

    // Find the max position to place it at the end
    const lastTask = await db.task.findFirst({
      where: {
        workspaceId,
        status: parsed.status,
        parentTaskId: null
      },
      orderBy: { position: "desc" },
      select: { position: true }
    })

    const newPosition = lastTask ? lastTask.position + 1000 : 1000

    const task = await db.task.create({
      data: {
        workspaceId,
        title: parsed.title,
        description: parsed.description,
        status: parsed.status,
        priority: parsed.priority,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        projectId: parsed.projectId,
        estimatedTime: parsed.estimatedTime,
        actualTime: parsed.actualTime,
        position: newPosition,
      },
      include: {
        project: true,
        checklists: true,
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        workspaceId,
        action: `Created task "${task.title}"`,
        entityType: "TASK",
        entityId: task.id,
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("[TASKS_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
