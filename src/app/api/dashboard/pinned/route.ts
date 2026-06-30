import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const pinned = await db.pinnedItem.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json(pinned)
  } catch (error) {
    console.error("[DASHBOARD_PINNED_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
