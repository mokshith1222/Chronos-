import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const history = await db.searchHistory.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("[SEARCH_HISTORY_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workspaceId, query } = body

    if (!workspaceId || !query || !query.trim()) {
      return NextResponse.json({ error: "workspaceId and query are required" }, { status: 400 })
    }

    // Check if it already exists to avoid clutter
    const existing = await db.searchHistory.findFirst({
      where: { workspaceId, query: query.trim() },
    })

    if (existing) {
      // Just update its timestamp
      const updated = await db.searchHistory.update({
        where: { id: existing.id },
        data: { createdAt: new Date() },
      })
      return NextResponse.json(updated)
    }

    const historyEntry = await db.searchHistory.create({
      data: {
        workspaceId,
        query: query.trim(),
      },
    })

    // Delete older entries to keep max 10
    const allHistory = await db.searchHistory.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    })

    if (allHistory.length > 10) {
      const idsToDelete = allHistory.slice(10).map((h) => h.id)
      await db.searchHistory.deleteMany({
        where: { id: { in: idsToDelete } },
      })
    }

    return NextResponse.json(historyEntry)
  } catch (error) {
    console.error("[SEARCH_HISTORY_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
