import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional().nullable(),
  folderId: z.string().optional().nullable(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isTrash: z.boolean().optional(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const note = await db.note.findUnique({
      where: { id },
      include: {
        folder: true,
      }
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("[NOTE_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateNoteSchema.parse(body)

    const note = await db.note.update({
      where: { id },
      data: parsed,
      include: {
        folder: true,
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("[NOTE_PATCH]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const note = await db.note.findUnique({ where: { id } })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // If the note is already in trash, delete it permanently. Otherwise, soft delete it (move to trash).
    if (note.isTrash) {
      await db.note.delete({
        where: { id }
      })
      return NextResponse.json({ success: true, permanent: true })
    } else {
      const trashed = await db.note.update({
        where: { id },
        data: { isTrash: true, isPinned: false, isFavorite: false }
      })
      return NextResponse.json({ success: true, permanent: false, note: trashed })
    }
  } catch (error) {
    console.error("[NOTE_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
