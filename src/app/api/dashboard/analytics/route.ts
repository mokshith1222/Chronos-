import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

function getDateRange(timeRange: string): { start: Date; end: Date; days: Date[] } {
  const now = new Date()
  switch (timeRange) {
    case "yesterday": {
      const yesterday = subDays(now, 1)
      const start = startOfDay(yesterday)
      const end = endOfDay(yesterday)
      return { start, end, days: [yesterday] }
    }
    case "thisWeek": {
      const start = startOfWeek(now, { weekStartsOn: 1 })
      const end = endOfWeek(now, { weekStartsOn: 1 })
      return { start, end, days: eachDayOfInterval({ start, end }) }
    }
    case "thisMonth": {
      const start = startOfMonth(now)
      const end = endOfMonth(now)
      return { start, end, days: eachDayOfInterval({ start, end }) }
    }
    case "today": {
      const start = startOfDay(now)
      const end = endOfDay(now)
      return { start, end, days: [now] }
    }
    default: {
      // Default: last 7 days
      const start = subDays(startOfDay(now), 6)
      const end = endOfDay(now)
      return { start, end, days: eachDayOfInterval({ start, end }) }
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId") || WORKSPACE_ID
    const timeRange = searchParams.get("timeRange") || "thisWeek"

    const { start, end, days } = getDateRange(timeRange)

    const timeEntries = await db.timeEntry.findMany({
      where: {
        workspaceId,
        startTime: { gte: start, lte: end },
      },
      include: {
        project: true,
      },
    })

    // 1. Build productivity chart data per day
    // For "today" or "yesterday" we show hours by hour-of-day
    // For week/month we show daily totals
    const isSingleDay = timeRange === "today" || timeRange === "yesterday"

    let weeklyProductivity: { day: string; hours: number }[] = []

    if (isSingleDay) {
      // Show 24-hour breakdown
      const hourMap: Record<string, number> = {}
      for (let h = 0; h < 24; h++) {
        hourMap[`${h}:00`] = 0
      }
      timeEntries.forEach((entry) => {
        const hour = new Date(entry.startTime).getHours()
        const key = `${hour}:00`
        hourMap[key] = (hourMap[key] || 0) + (entry.duration || 0) / 3600
      })
      // Only show hours with data, or compress to every 4 hours
      weeklyProductivity = Object.entries(hourMap)
        .filter((_, i) => i % 4 === 0) // Show every 4 hours
        .map(([hour, hours]) => ({
          day: hour,
          hours: Number(hours.toFixed(2)),
        }))
    } else {
      // Day-by-day breakdown
      const dayMap: Record<string, number> = {}
      days.forEach((day) => {
        const key = format(day, timeRange === "thisMonth" ? "d MMM" : "EEE")
        dayMap[key] = 0
      })

      timeEntries.forEach((entry) => {
        const entryDate = new Date(entry.startTime)
        const key = format(entryDate, timeRange === "thisMonth" ? "d MMM" : "EEE")
        if (dayMap[key] !== undefined) {
          dayMap[key] += (entry.duration || 0) / 3600
        }
      })

      weeklyProductivity = Object.entries(dayMap).map(([day, hours]) => ({
        day,
        hours: Number(hours.toFixed(2)),
      }))
    }

    // 2. Project distribution
    const projectMap: Record<string, { value: number; color: string }> = {}
    timeEntries.forEach((entry) => {
      const projectName = entry.project?.name || "Uncategorized"
      const projectColor = entry.project?.color || "hsl(var(--muted-foreground))"
      const durationHours = (entry.duration || 0) / 3600

      if (!projectMap[projectName]) {
        projectMap[projectName] = { value: 0, color: projectColor }
      }
      projectMap[projectName].value += durationHours
    })

    const projectDistribution = Object.entries(projectMap).map(([name, data]) => ({
      name,
      value: Number(data.value.toFixed(2)),
      color: data.color,
    }))

    return NextResponse.json({
      weeklyProductivity,
      projectDistribution,
    })
  } catch (error) {
    console.error("[DASHBOARD_ANALYTICS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
