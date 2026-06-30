import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    return NextResponse.json({ workspaceId: workspace.id })
  } catch (error) {
    console.error("[WORKSPACE_INIT_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Create a new anonymous user and a corresponding workspace
    const randomId = Math.random().toString(36).substring(2, 15)
    
    const user = await db.user.create({
      data: {
        email: `user-${randomId}@chronos.local`,
        name: "Workspace Owner",
      },
    })

    const workspace = await db.workspace.create({
      data: {
        name: "My Workspace",
        ownerId: user.id,
      },
    })

    return NextResponse.json({
      workspaceId: workspace.id,
      userId: user.id,
    }, { status: 201 })
  } catch (error) {
    console.error("[WORKSPACE_INIT_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
