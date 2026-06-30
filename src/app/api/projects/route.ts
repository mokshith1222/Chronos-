import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { projectSchema } from "@/lib/validations/project"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const projects = await db.project.findMany({
      where: {
        workspaceId,
      },
      include: {
        _count: {
          select: { tasks: true, timeEntries: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PROJECTS_GET]", error)
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

    const parsed = projectSchema.parse(body)

    const project = await db.project.create({
      data: {
        workspaceId,
        name: parsed.name,
        color: parsed.color,
        status: parsed.status,
      }
    })

    // Log the activity
    await db.activityLog.create({
      data: {
        workspaceId,
        action: `Created project "${project.name}"`,
        entityType: "PROJECT",
        entityId: project.id,
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("[PROJECTS_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
