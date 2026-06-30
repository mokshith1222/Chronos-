import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
  parentId: z.string().optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const folders = await db.folder.findMany({
      where: {
        workspaceId,
      },
      include: {
        _count: {
          select: { notes: { where: { isTrash: false, isArchived: false } } }
        }
      },
      orderBy: {
        name: "asc",
      }
    })

    return NextResponse.json(folders)
  } catch (error) {
    console.error("[FOLDERS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const body = await req.json()

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const parsed = createFolderSchema.parse(body)

    const folder = await db.folder.create({
      data: {
        workspaceId,
        name: parsed.name,
        parentId: parsed.parentId,
      }
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error("[FOLDERS_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
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

    await db.folder.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[FOLDERS_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
