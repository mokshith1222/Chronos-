import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // Fetch all completed time entries for the current week
    const weeklyEntries = await db.timeEntry.findMany({
      where: {
        workspaceId,
        endTime: { not: null },
        startTime: { gte: startOfWeek },
      },
      select: {
        duration: true,
        startTime: true,
        isProductive: true,
        type: true,
        projectId: true,
        project: {
          select: { name: true, color: true }
        }
      }
    })

    // Compute stats
    let totalDuration = 0
    let productiveDuration = 0
    let deepWorkDuration = 0
    let pomodoroCount = 0

    const projectDistributionMap = new Map<string, { name: string; color: string; duration: number }>()
    const dailyActivityMap = new Map<number, number>() // day of week -> duration in seconds

    // Initialize daily activity map for 7 days
    for (let i = 0; i < 7; i++) {
      dailyActivityMap.set(i, 0)
    }

    weeklyEntries.forEach(entry => {
      const duration = entry.duration || 0
      totalDuration += duration
      if (entry.isProductive) productiveDuration += duration
      if (entry.type === "DEEP_WORK") deepWorkDuration += duration
      if (entry.type === "POMODORO") pomodoroCount += 1

      // Group by project
      if (entry.projectId && entry.project) {
        const existing = projectDistributionMap.get(entry.projectId)
        if (existing) {
          existing.duration += duration
        } else {
          projectDistributionMap.set(entry.projectId, {
            name: entry.project.name,
            color: entry.project.color || "hsl(var(--primary))",
            duration,
          })
        }
      } else {
        const existing = projectDistributionMap.get("no-project")
        if (existing) {
          existing.duration += duration
        } else {
          projectDistributionMap.set("no-project", {
            name: "No Project",
            color: "#64748b", // slate-500
            duration,
          })
        }
      }

      // Group by day of week
      const day = new Date(entry.startTime).getDay()
      const currentDayDuration = dailyActivityMap.get(day) || 0
      dailyActivityMap.set(day, currentDayDuration + duration)
    })

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dailyActivity = Array.from(dailyActivityMap.entries()).map(([dayIdx, duration]) => ({
      name: days[dayIdx],
      hours: Math.round((duration / 3600) * 10) / 10,
    }))

    const projectDistribution = Array.from(projectDistributionMap.entries()).map(([_, data]) => ({
      name: data.name,
      value: Math.round((data.duration / 3600) * 10) / 10,
      color: data.color,
    }))

    const stats = {
      totalHours: Math.round((totalDuration / 3600) * 10) / 10,
      productivityScore: totalDuration > 0 ? Math.round((productiveDuration / totalDuration) * 100) : 0,
      deepWorkHours: Math.round((deepWorkDuration / 3600) * 10) / 10,
      pomodorosCompleted: pomodoroCount,
      dailyActivity,
      projectDistribution,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[TIME_STATS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
