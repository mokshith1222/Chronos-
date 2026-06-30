import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params
    const body = await req.json()
    const { title, dueDate } = body

    if (!title) {
      return NextResponse.json({ error: "Milestone title is required" }, { status: 400 })
    }

    const goal = await db.goal.findUnique({
      where: { id: goalId },
      include: { milestones: true },
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    // Create the milestone
    const milestone = await db.goalMilestone.create({
      data: {
        goalId,
        title,
        status: "TODO",
        isCompleted: false,
        position: goal.milestones.length,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    // Recalculate parent goal progress
    const allMilestones = [...goal.milestones, milestone]
    const completedCount = allMilestones.filter(m => m.isCompleted).length
    const progress = Math.round((completedCount / allMilestones.length) * 100)

    await db.goal.update({
      where: { id: goalId },
      data: { progress },
    })

    return NextResponse.json(milestone)
  } catch (error) {
    console.error("[MILESTONES_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params
    const body = await req.json()
    const { milestoneId, title, isCompleted, dueDate, delete: shouldDelete } = body

    if (!milestoneId) {
      return NextResponse.json({ error: "milestoneId is required" }, { status: 400 })
    }

    if (shouldDelete) {
      // Delete milestone
      await db.goalMilestone.delete({
        where: { id: milestoneId },
      })
    } else {
      // Update milestone
      await db.goalMilestone.update({
        where: { id: milestoneId },
        data: {
          title: title !== undefined ? title : undefined,
          isCompleted: isCompleted !== undefined ? isCompleted : undefined,
          status: isCompleted === true ? "COMPLETED" : (isCompleted === false ? "TODO" : undefined),
          dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        },
      })
    }

    // Fetch all remaining milestones to recalculate progress
    const remainingMilestones = await db.goalMilestone.findMany({
      where: { goalId },
    })

    let progress = 0
    if (remainingMilestones.length > 0) {
      const completedCount = remainingMilestones.filter(m => m.isCompleted).length
      progress = Math.round((completedCount / remainingMilestones.length) * 100)
    }

    const updatedGoal = await db.goal.update({
      where: { id: goalId },
      data: {
        progress,
        status: progress === 100 ? "COMPLETED" : undefined,
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
    console.error("[MILESTONES_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
