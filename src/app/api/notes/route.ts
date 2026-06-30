import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).default("Untitled Note"),
  content: z.string().optional().nullable().default(""),
  folderId: z.string().optional().nullable(),
  isPinned: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  isTrash: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const folderId = searchParams.get("folderId")
    const isPinned = searchParams.get("isPinned") === "true" ? true : undefined
    const isFavorite = searchParams.get("isFavorite") === "true" ? true : undefined
    const isArchived = searchParams.get("isArchived") === "true"
    const isTrash = searchParams.get("isTrash") === "true"
    const search = searchParams.get("search") || ""

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const whereClause: any = {
      workspaceId,
      isArchived,
      isTrash,
    }

    if (folderId === "none") {
      whereClause.folderId = null
    } else if (folderId) {
      whereClause.folderId = folderId
    }

    if (isPinned) whereClause.isPinned = true
    if (isFavorite) whereClause.isFavorite = true

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const notes = await db.note.findMany({
      where: whereClause,
      include: {
        folder: true,
      },
      orderBy: [
        { isPinned: "desc" },
        { updatedAt: "desc" },
      ]
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("[NOTES_GET]", error)
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

    const parsed = createNoteSchema.parse(body)

    const note = await db.note.create({
      data: {
        workspaceId,
        title: parsed.title,
        content: parsed.content,
        folderId: parsed.folderId,
        isPinned: parsed.isPinned,
        isFavorite: parsed.isFavorite,
        isArchived: parsed.isArchived,
        isTrash: parsed.isTrash,
      },
      include: {
        folder: true,
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("[NOTES_POST]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
