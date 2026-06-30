import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = await req.json()
    const { isArchived } = body

    if (typeof isArchived !== 'boolean') {
      return NextResponse.json({ error: "isArchived boolean is required" }, { status: 400 })
    }

    const project = await db.project.update({
      where: {
        id
      },
      data: {
        isArchived,
        deletedAt: isArchived ? new Date() : null
      }
    })

    await db.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        action: `${isArchived ? 'Archived' : 'Restored'} project "${project.name}"`,
        entityType: "PROJECT",
        entityId: project.id,
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_ARCHIVE_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
