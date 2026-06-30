import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Find last checklist item position
    const lastItem = await db.checklistItem.findFirst({
      where: { taskId: id },
      orderBy: { position: "desc" },
      select: { position: true }
    })

    const newPosition = lastItem ? lastItem.position + 1 : 0

    const item = await db.checklistItem.create({
      data: {
        taskId: id,
        title,
        position: newPosition,
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("[TASK_CHECKLISTS_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get("itemId")
    const body = await req.json()
    const { isCompleted, title } = body

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 })
    }

    const item = await db.checklistItem.update({
      where: { id: itemId },
      data: {
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
        title: title || undefined,
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("[TASK_CHECKLISTS_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 })
    }

    await db.checklistItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TASK_CHECKLISTS_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
