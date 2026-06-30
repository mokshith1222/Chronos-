import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { IntegrationService } from "@/lib/integration-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const activeSession = await db.timeEntry.findFirst({
      where: {
        workspaceId,
        endTime: null,
      },
      include: {
        project: true,
        task: true,
      }
    })

    return NextResponse.json(activeSession || null)
  } catch (error) {
    console.error("[TIME_SESSION_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const body = await req.json()
    const { projectId, taskId, description, type, tags } = body

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    // Safety check: Stop any existing active session first
    const activeSession = await db.timeEntry.findFirst({
      where: {
        workspaceId,
        endTime: null,
      }
    })

    const now = new Date()

    if (activeSession) {
      const duration = Math.round((now.getTime() - new Date(activeSession.startTime).getTime()) / 1000)
      await db.timeEntry.update({
        where: { id: activeSession.id },
        data: {
          endTime: now,
          duration: duration > 0 ? duration : 0,
        }
      })
    }

    // Start new session
    const session = await db.timeEntry.create({
      data: {
        workspaceId,
        projectId: projectId || null,
        taskId: taskId || null,
        description: description || null,
        type: type || "NORMAL",
        tags: tags || null,
        startTime: now,
      },
      include: {
        project: true,
        task: true,
      }
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error("[TIME_SESSION_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const body = await req.json()
    const { description, projectId, taskId, notes, mood, energyLevel, productivityRating, tags, isProductive } = body

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const activeSession = await db.timeEntry.findFirst({
      where: {
        workspaceId,
        endTime: null,
      }
    })

    if (!activeSession) {
      return NextResponse.json({ error: "No active session found" }, { status: 404 })
    }

    const updated = await db.timeEntry.update({
      where: { id: activeSession.id },
      data: {
        description: description !== undefined ? description : undefined,
        projectId: projectId !== undefined ? projectId : undefined,
        taskId: taskId !== undefined ? taskId : undefined,
        notes: notes !== undefined ? notes : undefined,
        mood: mood !== undefined ? mood : undefined,
        energyLevel: energyLevel !== undefined ? energyLevel : undefined,
        productivityRating: productivityRating !== undefined ? productivityRating : undefined,
        tags: tags !== undefined ? tags : undefined,
        isProductive: isProductive !== undefined ? isProductive : undefined,
      },
      include: {
        project: true,
        task: true,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[TIME_SESSION_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const activeSession = await db.timeEntry.findFirst({
      where: {
        workspaceId,
        endTime: null,
      }
    })

    if (!activeSession) {
      return NextResponse.json({ error: "No active session found" }, { status: 404 })
    }

    const now = new Date()
    const duration = Math.round((now.getTime() - new Date(activeSession.startTime).getTime()) / 1000)

    const stopped = await db.timeEntry.update({
      where: { id: activeSession.id },
      data: {
        endTime: now,
        duration: duration > 0 ? duration : 0,
      },
      include: {
        project: true,
        task: true,
      }
    })

    // Update task actualTime using IntegrationService
    await IntegrationService.handleTimeEntryStop(activeSession.id)

    return NextResponse.json(stopped)
  } catch (error) {
    console.error("[TIME_SESSION_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
