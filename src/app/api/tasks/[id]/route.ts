import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { IntegrationService } from "@/lib/integration-service"
import { taskUpdateSchema } from "@/lib/validations/task"
import { z } from "zod"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const task = await db.task.findUnique({
      where: { id },
      include: {
        project: true,
        checklists: {
          orderBy: { position: "asc" }
        },
        subtasks: {
          where: { isArchived: false },
          include: {
            checklists: true,
            _count: { select: { subtasks: true, checklists: true } }
          },
          orderBy: { position: "asc" }
        },
        dependencies: {
          include: {
            dependsOnTask: true
          }
        },
        dependents: {
          include: {
            task: true
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASK_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = taskUpdateSchema.parse(body)

    const updateData: any = { ...parsed }
    if (parsed.dueDate) {
      updateData.dueDate = new Date(parsed.dueDate)
    }
    if (parsed.status === "DONE" && !updateData.completedAt) {
      updateData.completedAt = new Date()
    } else if (parsed.status && parsed.status !== "DONE") {
      updateData.completedAt = null
    }

    let task;
    if (parsed.status) {
      // Use IntegrationService to handle status update + side-effects
      task = await IntegrationService.handleTaskCompletion(id, parsed.status)
      
      // Update any other remaining fields
      const remainingUpdates = { ...updateData }
      delete remainingUpdates.status
      delete remainingUpdates.completedAt
      
      if (Object.keys(remainingUpdates).length > 0) {
        task = await db.task.update({
          where: { id },
          data: remainingUpdates,
          include: {
            project: true,
            checklists: true,
          }
        })
      } else {
        // Refetch with includes to match return signature
        task = await db.task.findUnique({
          where: { id },
          include: {
            project: true,
            checklists: true,
          }
        })
      }
    } else {
      task = await db.task.update({
        where: { id },
        data: updateData,
        include: {
          project: true,
          checklists: true,
        }
      })
    }

    await db.activityLog.create({
      data: {
        workspaceId: task!.workspaceId,
        action: `Updated task "${task!.title}"`,
        entityType: "TASK",
        entityId: task!.id,
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASK_PATCH]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const task = await db.task.findUnique({ where: { id } })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await db.task.delete({
      where: { id }
    })

    await db.activityLog.create({
      data: {
        workspaceId: task.workspaceId,
        action: `Permanently deleted task "${task.title}"`,
        entityType: "TASK",
        entityId: task.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TASK_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
