import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const projects = await db.project.findMany({
      where: { workspaceId, isArchived: false, status: "ACTIVE" },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[DASHBOARD_PROJECTS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
