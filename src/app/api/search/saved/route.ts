import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const saved = await db.savedSearch.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error("[SAVED_SEARCH_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workspaceId, name, query, filters } = body

    if (!workspaceId || !name || !query) {
      return NextResponse.json({ error: "workspaceId, name and query are required" }, { status: 400 })
    }

    const savedSearch = await db.savedSearch.create({
      data: {
        workspaceId,
        name: name.trim(),
        query: query.trim(),
        filters: filters || null,
      },
    })

    return NextResponse.json(savedSearch)
  } catch (error) {
    console.error("[SAVED_SEARCH_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    await db.savedSearch.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[SAVED_SEARCH_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
