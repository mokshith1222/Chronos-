import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const notes = await db.note.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("[DASHBOARD_NOTES_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
