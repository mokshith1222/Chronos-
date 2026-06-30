import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { taskReorderSchema } from "@/lib/validations/task"
import { z } from "zod"

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = taskReorderSchema.parse(body)

    // Execute in a transaction to update positions of multiple tasks
    const updates = parsed.taskIds.map((id, index) => {
      const data: any = {
        position: (index + 1) * 1000,
      }
      if (parsed.status) {
        data.status = parsed.status
        if (parsed.status === "DONE") {
          data.completedAt = new Date()
        } else {
          data.completedAt = null
        }
      }
      return db.task.update({
        where: { id },
        data,
      })
    })

    await db.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TASKS_REORDER_PATCH]", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
