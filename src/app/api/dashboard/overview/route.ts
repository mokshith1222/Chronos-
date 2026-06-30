import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

function getDateRange(timeRange: string) {
  const now = new Date()
  switch (timeRange) {
    case "yesterday": {
      const yesterday = subDays(now, 1)
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) }
    }
    case "thisWeek":
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    case "thisMonth":
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case "today":
    default:
      return { start: startOfDay(now), end: endOfDay(now) }
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const timeRange = searchParams.get("timeRange") || "today"

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      )
    }

    const { start, end } = getDateRange(timeRange)

    // Parallel data fetching for high performance
    const [
      activeProjectsCount,
      tasksCompleted,
      timeEntries,
      goalsProgress
    ] = await Promise.all([
      db.project.count({
        where: {
          workspaceId,
          isArchived: false,
          status: "ACTIVE"
        }
      }),
      db.task.count({
        where: {
          workspaceId,
          status: "DONE",
          completedAt: {
            gte: start,
            lte: end
          }
        }
      }),
      db.timeEntry.findMany({
        where: {
          workspaceId,
          startTime: {
            gte: start,
            lte: end
          }
        },
        select: {
          duration: true,
          isProductive: true
        }
      }),
      db.goal.findMany({
        where: {
          workspaceId,
          status: "ACTIVE"
        },
        select: {
          progress: true
        }
      })
    ])

    // Calculate Hours & Productivity
    let totalSeconds = 0
    let productiveSeconds = 0

    timeEntries.forEach(entry => {
      if (entry.duration) {
        totalSeconds += entry.duration
        if (entry.isProductive) {
          productiveSeconds += entry.duration
        }
      }
    })

    const totalHoursToday = Number((totalSeconds / 3600).toFixed(2))
    const productivityScore = totalSeconds > 0 
      ? Math.round((productiveSeconds / totalSeconds) * 100) 
      : 0

    // Calculate average goals progress
    const avgGoalProgress = goalsProgress.length > 0
      ? Math.round(goalsProgress.reduce((acc, curr) => acc + curr.progress, 0) / goalsProgress.length)
      : 0

    return NextResponse.json({
      activeProjects: activeProjectsCount,
      tasksCompletedToday: tasksCompleted,
      totalHoursToday,
      productivityScore,
      avgGoalProgress
    })
  } catch (error) {
    console.error("[DASHBOARD_OVERVIEW_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
