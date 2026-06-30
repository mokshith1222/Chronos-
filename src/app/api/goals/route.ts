import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const where: any = {
      workspaceId,
    }

    if (status && status !== "ALL") {
      where.status = status
    }
    if (category && category !== "ALL") {
      where.category = category
    }
    if (priority && priority !== "ALL") {
      where.priority = priority
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const goals = await db.goal.findMany({
      where,
      include: {
        milestones: {
          orderBy: {
            position: "asc",
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error("[GOALS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      workspaceId,
      title,
      description,
      category,
      priority,
      targetDate,
      targetValue,
      currentValue,
      units,
      color,
      icon,
      tags,
      notes,
      projectId,
      taskId,
      milestones,
    } = body

    if (!workspaceId || !title) {
      return NextResponse.json({ error: "workspaceId and title are required" }, { status: 400 })
    }

    // Create the goal along with any milestones
    const goal = await db.goal.create({
      data: {
        workspaceId,
        title,
        description,
        category: category || "PERSONAL",
        priority: priority || "MEDIUM",
        targetDate: targetDate ? new Date(targetDate) : null,
        targetValue: targetValue !== undefined ? parseFloat(targetValue) : null,
        currentValue: currentValue !== undefined ? parseFloat(currentValue) : 0,
        units,
        color: color || "#3b82f6",
        icon: icon || "Target",
        tags,
        notes,
        projectId: projectId || null,
        taskId: taskId || null,
        status: "ACTIVE",
        progress: 0,
        milestones: milestones && milestones.length > 0 ? {
          create: milestones.map((m: { title: string; dueDate?: string }, index: number) => ({
            title: m.title,
            status: "TODO",
            isCompleted: false,
            position: index,
            dueDate: m.dueDate ? new Date(m.dueDate) : null,
          })),
        } : undefined,
      },
      include: {
        milestones: true,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("[GOALS_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
