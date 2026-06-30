import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")
    const projectId = searchParams.get("projectId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    // Default to last 7 days if no dates provided
    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam ? new Date(startDateParam) : new Date()
    if (!startDateParam) {
      startDate.setDate(endDate.getDate() - 7)
    }
    
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    const dateDiffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const dateDiffDays = Math.max(1, Math.ceil(dateDiffTime / (1000 * 60 * 60 * 24)))

    // --- 1. Fetch Time Entries ---
    const timeEntryWhere: any = {
      workspaceId,
      startTime: { gte: startDate, lte: endDate },
    }
    if (projectId) {
      timeEntryWhere.projectId = projectId
    }

    const timeEntries = await db.timeEntry.findMany({
      where: timeEntryWhere,
      orderBy: { startTime: "asc" },
      include: { task: true },
    })

    // --- 2. Fetch Tasks ---
    const taskWhere: any = {
      workspaceId,
    }
    if (projectId) {
      taskWhere.projectId = projectId
    }
    
    // Fetch tasks created or completed in the range
    const tasks = await db.task.findMany({
      where: {
        ...taskWhere,
        OR: [
          { createdAt: { gte: startDate, lte: endDate } },
          { completedAt: { gte: startDate, lte: endDate } },
        ],
      },
    })

    // --- 3. Fetch Habits & History ---
    const habits = await db.habit.findMany({
      where: {
        workspaceId,
        status: "ACTIVE",
      },
      include: {
        history: {
          where: {
            date: { gte: startDate, lte: endDate },
            status: "COMPLETED",
          },
        },
      },
    })

    // --- 4. Fetch Calendar Events (for planning score) ---
    const calendarEvents = await db.calendarEvent.findMany({
      where: {
        workspaceId,
        startTime: { gte: startDate, lte: endDate },
        type: "TIME_BLOCK",
      },
    })

    // ==========================================
    // METRICS CALCULATIONS
    // ==========================================

    // A. Time Metrics
    let totalSeconds = 0
    let productiveSeconds = 0
    let deepWorkSeconds = 0
    const projectTimeMap: Record<string, { name: string; seconds: number; color: string }> = {}
    const taskTimeMap: Record<string, { title: string; seconds: number }> = {}

    // Track hourly & daily distribution
    const hourlyDistribution = Array(24).fill(0)
    const dailyDistribution = Array(7).fill(0) // 0=Sun, 1=Mon...

    timeEntries.forEach((entry) => {
      const duration = entry.duration || 0
      totalSeconds += duration

      if (entry.isProductive) {
        productiveSeconds += duration
      }

      if (entry.type === "DEEP_WORK" || entry.type === "POMODORO") {
        deepWorkSeconds += duration
      }

      // Project allocation
      if (entry.projectId) {
        if (!projectTimeMap[entry.projectId]) {
          projectTimeMap[entry.projectId] = {
            name: entry.projectId, // fallback
            seconds: 0,
            color: "#3b82f6",
          }
        }
        projectTimeMap[entry.projectId].seconds += duration
      }

      // Task allocation
      if (entry.taskId && entry.task) {
        if (!taskTimeMap[entry.taskId]) {
          taskTimeMap[entry.taskId] = {
            title: entry.task.title,
            seconds: 0,
          }
        }
        taskTimeMap[entry.taskId].seconds += duration
      }

      // Hour of day (local)
      const startHour = new Date(entry.startTime).getHours()
      hourlyDistribution[startHour] += duration

      // Day of week (local)
      const startDay = new Date(entry.startTime).getDay()
      dailyDistribution[startDay] += duration
    })

    // B. Task Metrics
    const tasksCreated = tasks.filter(t => t.createdAt >= startDate && t.createdAt <= endDate).length
    const tasksCompleted = tasks.filter(t => t.completedAt && t.completedAt >= startDate && t.completedAt <= endDate).length

    // C. Habit Metrics
    let totalPossibleHabits = habits.length * dateDiffDays
    let actualHabitCompletions = habits.reduce((acc, h) => acc + h.history.length, 0)

    // D. Calendar Planning Metrics
    let timeBlockedSeconds = calendarEvents.reduce((acc, event) => {
      const diff = new Date(event.endTime).getTime() - new Date(event.startTime).getTime()
      return acc + Math.max(0, diff / 1000)
    }, 0)

    // ==========================================
    // PRODUCTIVITY SCORE ENGINE
    // ==========================================
    const focusScore = totalSeconds > 0 
      ? Math.round((productiveSeconds / totalSeconds) * 100) 
      : 0

    const consistencyScore = totalPossibleHabits > 0 
      ? Math.round((actualHabitCompletions / totalPossibleHabits) * 100) 
      : 0

    const completionScore = tasksCreated > 0 
      ? Math.round((tasksCompleted / tasksCreated) * 100) 
      : 0

    // Target: 2 hours of deep work per day
    const targetDeepWorkSeconds = dateDiffDays * 2 * 3600
    const deepWorkScore = targetDeepWorkSeconds > 0
      ? Math.min(100, Math.round((deepWorkSeconds / targetDeepWorkSeconds) * 100))
      : 0

    // Target: 50% of productive time is planned/blocked on calendar
    const planningScore = productiveSeconds > 0
      ? Math.min(100, Math.round((timeBlockedSeconds / productiveSeconds) * 100))
      : 0

    // Weighted Overall Productivity Index (OPI)
    const overallProductivityIndex = Math.round(
      0.3 * focusScore +
      0.2 * consistencyScore +
      0.2 * completionScore +
      0.15 * deepWorkScore +
      0.15 * planningScore
    )

    // ==========================================
    // TRENDS OVER TIME (Day-by-Day)
    // ==========================================
    const dayLabels: string[] = []
    const trendDataMap: Record<string, { date: string; productive: number; unproductive: number; tasks: number }> = {}

    for (let i = 0; i < dateDiffDays; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().split("T")[0]
      dayLabels.push(dateStr)
      trendDataMap[dateStr] = {
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        productive: 0,
        unproductive: 0,
        tasks: 0,
      }
    }

    // Populate trend time
    timeEntries.forEach((entry) => {
      const dateStr = new Date(entry.startTime).toISOString().split("T")[0]
      if (trendDataMap[dateStr]) {
        const hours = (entry.duration || 0) / 3600
        if (entry.isProductive) {
          trendDataMap[dateStr].productive += hours
        } else {
          trendDataMap[dateStr].unproductive += hours
        }
      }
    })

    // Populate trend tasks completed
    tasks.forEach((task) => {
      if (task.completedAt) {
        const dateStr = new Date(task.completedAt).toISOString().split("T")[0]
        if (trendDataMap[dateStr]) {
          trendDataMap[dateStr].tasks += 1
        }
      }
    })

    const trends = Object.values(trendDataMap)

    // ==========================================
    // PEAK HOURS & DAYS
    // ==========================================
    const peakHourValue = Math.max(...hourlyDistribution)
    const peakHour = hourlyDistribution.indexOf(peakHourValue)

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const peakDayValue = Math.max(...dailyDistribution)
    const peakDayIndex = dailyDistribution.indexOf(peakDayValue)
    const peakDay = daysOfWeek[peakDayIndex]

    // ==========================================
    // SMART INSIGHTS & RECOMMENDATIONS
    // ==========================================
    const insights: string[] = []
    
    if (focusScore < 70 && totalSeconds > 0) {
      insights.push(`Your focus score is ${focusScore}%. Try using the Pomodoro timer or blocking distracting sites to stay on task.`)
    }
    if (completionScore < 50 && tasksCreated > 5) {
      insights.push(`You completed only ${completionScore}% of new tasks. Consider breaking larger tasks into smaller milestones.`)
    }
    if (consistencyScore < 60 && habits.length > 0) {
      insights.push(`Habit consistency is at ${consistencyScore}%. Try setting reminders for your key habits earlier in the day.`)
    }
    if (deepWorkSeconds < targetDeepWorkSeconds * 0.5 && totalSeconds > 0) {
      insights.push(`Your deep work hours are below target. Try scheduling a dedicated 90-minute focus block in your calendar.`)
    }
    if (planningScore < 30 && productiveSeconds > 3600 * 5) {
      insights.push(`Only ${planningScore}% of your productive time was time-blocked. Try 'time blocking' your tasks to increase efficiency.`)
    }
    if (insights.length === 0) {
      insights.push("Excellent work! You are maintaining a highly balanced and productive routine across all metrics.")
    }

    return NextResponse.json({
      summary: {
        totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
        productiveHours: Math.round((productiveSeconds / 3600) * 10) / 10,
        deepWorkHours: Math.round((deepWorkSeconds / 3600) * 10) / 10,
        tasksCompleted,
        tasksCreated,
        habitsCompleted: actualHabitCompletions,
        habitsTotal: habits.length,
      },
      scores: {
        focus: focusScore,
        consistency: consistencyScore,
        completion: completionScore,
        deepWork: deepWorkScore,
        planning: planningScore,
        overall: overallProductivityIndex,
      },
      allocation: {
        projects: Object.entries(projectTimeMap).map(([id, data]) => ({
          id,
          name: data.name,
          value: Math.round((data.seconds / 3600) * 10) / 10,
          color: data.color,
        })),
        tasks: Object.entries(taskTimeMap).map(([id, data]) => ({
          id,
          title: data.title,
          value: Math.round((data.seconds / 3600) * 10) / 10,
        })).sort((a, b) => b.value - a.value).slice(0, 5),
      },
      trends,
      peakTime: {
        bestHour: `${peakHour}:00`,
        bestDay: peakDay,
        hourly: hourlyDistribution.map((seconds, hour) => ({ hour: `${hour}:00`, hours: Math.round((seconds / 3600) * 10) / 10 })),
        daily: dailyDistribution.map((seconds, index) => ({ day: daysOfWeek[index].substring(0, 3), hours: Math.round((seconds / 3600) * 10) / 10 })),
      },
      insights,
    })
  } catch (error) {
    console.error("[REPORTS_ANALYTICS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
