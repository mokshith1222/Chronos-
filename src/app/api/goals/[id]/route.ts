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
      category,
      priority,
      status,
      targetDate,
      currentValue,
      targetValue,
      units,
      color,
      icon,
      tags,
      notes,
      projectId,
      taskId,
    } = body

    // 1. Get the current goal and its milestones
    const existingGoal = await db.goal.findUnique({
      where: { id },
      include: {
        milestones: true,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    // 2. Determine new values
    const newCurrentValue = currentValue !== undefined ? parseFloat(currentValue) : existingGoal.currentValue
    const newTargetValue = targetValue !== undefined ? (targetValue === null ? null : parseFloat(targetValue)) : existingGoal.targetValue

    let progress = existingGoal.progress

    // 3. Recalculate progress
    if (newTargetValue !== null && newTargetValue > 0) {
      // Numeric target progress
      progress = Math.min(100, Math.max(0, Math.round((newCurrentValue / newTargetValue) * 100)))
    } else if (existingGoal.milestones.length > 0) {
      // Milestone-based progress
      const completedCount = existingGoal.milestones.filter(m => m.isCompleted).length
      progress = Math.round((completedCount / existingGoal.milestones.length) * 100)
    } else if (body.progress !== undefined) {
      // Manual progress
      progress = Math.min(100, Math.max(0, parseInt(body.progress)))
    }

    // Auto-complete if progress is 100%
    let newStatus = status || existingGoal.status
    if (progress === 100 && existingGoal.progress < 100 && !status) {
      newStatus = "COMPLETED"
    } else if (progress < 100 && existingGoal.progress === 100 && existingGoal.status === "COMPLETED" && !status) {
      newStatus = "ACTIVE"
    }

    const updatedGoal = await db.goal.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        category: category !== undefined ? category : undefined,
        priority: priority !== undefined ? priority : undefined,
        status: newStatus,
        targetDate: targetDate !== undefined ? (targetDate ? new Date(targetDate) : null) : undefined,
        currentValue: newCurrentValue,
        targetValue: newTargetValue,
        units: units !== undefined ? units : undefined,
        color: color !== undefined ? color : undefined,
        icon: icon !== undefined ? icon : undefined,
        tags: tags !== undefined ? tags : undefined,
        notes: notes !== undefined ? notes : undefined,
        projectId: projectId !== undefined ? (projectId ? projectId : null) : undefined,
        taskId: taskId !== undefined ? (taskId ? taskId : null) : undefined,
        progress,
      },
      include: {
        milestones: {
          orderBy: {
            position: "asc",
          },
        },
      },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("[GOAL_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingGoal = await db.goal.findUnique({
      where: { id },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    await db.goal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[GOAL_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
