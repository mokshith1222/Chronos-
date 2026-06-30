import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const status = searchParams.get("status")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const where: any = {
      workspaceId,
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    const habits = await db.habit.findMany({
      where,
      include: {
        history: {
          orderBy: {
            date: "desc",
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

    return NextResponse.json(habits)
  } catch (error) {
    console.error("[HABITS_GET]", error)
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
      frequency,
      customDays,
      targetCount,
      isNegative,
      color,
      icon,
      projectId,
      taskId,
    } = body

    if (!workspaceId || !title) {
      return NextResponse.json({ error: "workspaceId and title are required" }, { status: 400 })
    }

    const habit = await db.habit.create({
      data: {
        workspaceId,
        title,
        description,
        frequency: frequency || "DAILY",
        customDays: customDays || null,
        targetCount: targetCount !== undefined ? parseInt(targetCount) : 1,
        isNegative: isNegative || false,
        status: "ACTIVE",
        color: color || "#f59e0b",
        icon: icon || "Activity",
        projectId: projectId || null,
        taskId: taskId || null,
        currentStreak: 0,
        longestStreak: 0,
      },
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error("[HABITS_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
