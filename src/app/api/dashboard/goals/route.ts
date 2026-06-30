import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const goals = await db.goal.findMany({
      where: {
        workspaceId,
        status: "ACTIVE"
      },
      orderBy: {
        progress: 'desc'
      },
      take: 3,
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error("[DASHBOARD_GOALS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
