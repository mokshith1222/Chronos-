import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      title,
      description,
      frequency,
      customDays,
      targetCount,
      isNegative,
      status,
      color,
      icon,
      projectId,
      taskId,
    } = body

    const existingHabit = await db.habit.findUnique({
      where: { id },
    })

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    const updatedHabit = await db.habit.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        frequency: frequency !== undefined ? frequency : undefined,
        customDays: customDays !== undefined ? customDays : undefined,
        targetCount: targetCount !== undefined ? parseInt(targetCount) : undefined,
        isNegative: isNegative !== undefined ? isNegative : undefined,
        status: status !== undefined ? status : undefined,
        color: color !== undefined ? color : undefined,
        icon: icon !== undefined ? icon : undefined,
        projectId: projectId !== undefined ? (projectId ? projectId : null) : undefined,
        taskId: taskId !== undefined ? (taskId ? taskId : null) : undefined,
      },
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    console.error("[HABIT_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingHabit = await db.habit.findUnique({
      where: { id },
    })

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    await db.habit.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[HABIT_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
