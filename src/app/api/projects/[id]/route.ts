import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { projectUpdateSchema } from "@/lib/validations/project"
import { z } from "zod"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const project = await db.project.findUnique({
      where: {
        id
      },
      include: {
        tasks: {
          take: 5,
          orderBy: { updatedAt: 'desc' }
        },
        _count: {
          select: { tasks: true, timeEntries: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = projectUpdateSchema.parse(body)

    const project = await db.project.update({
      where: {
        id
      },
      data: parsed
    })

    await db.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        action: `Updated project "${project.name}"`,
        entityType: "PROJECT",
        entityId: project.id,
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_PATCH]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const project = await db.project.findUnique({ where: { id } })
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    await db.project.delete({
      where: {
        id
      }
    })

    await db.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        action: `Deleted project "${project.name}" permanently`,
        entityType: "PROJECT",
        entityId: project.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PROJECT_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
