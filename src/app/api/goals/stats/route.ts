import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    // 1. Fetch all goals for the workspace
    const goals = await db.goal.findMany({
      where: { workspaceId },
      include: { milestones: true },
    })

    // 2. Fetch all habits and their history
    const habits = await db.habit.findMany({
      where: { workspaceId },
      include: { history: true },
    })

    // --- Goal Stats ---
    const totalGoals = goals.length
    const completedGoals = goals.filter(g => g.status === "COMPLETED").length
    const activeGoals = goals.filter(g => g.status === "ACTIVE").length
    const averageProgress = totalGoals > 0 
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals) 
      : 0

    const goalsByCategory = goals.reduce((acc: Record<string, number>, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1
      return acc;
    }, {})

    const goalsByPriority = goals.reduce((acc: Record<string, number>, g) => {
      acc[g.priority] = (acc[g.priority] || 0) + 1
      return acc;
    }, {})

    // --- Habit Stats ---
    const totalHabits = habits.length
    const activeHabits = habits.filter(h => h.status === "ACTIVE").length
    const averageStreak = totalHabits > 0 
      ? Math.round(habits.reduce((acc, h) => acc + h.currentStreak, 0) / totalHabits) 
      : 0
    
    const bestStreak = totalHabits > 0 
      ? Math.max(...habits.map(h => h.longestStreak)) 
      : 0

    // Habit completion rate in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    let totalPossibleCompletions = 0
    let actualCompletions = 0

    habits.forEach(h => {
      if (h.status === "ACTIVE") {
        // For simplicity, assume daily frequency. In a real system, we'd adjust based on frequency.
        totalPossibleCompletions += 30
        const completionsInLast30Days = h.history.filter(hist => 
          hist.status === "COMPLETED" && new Date(hist.date) >= thirtyDaysAgo
        ).length
        actualCompletions += completionsInLast30Days
      }
    })

    const consistencyScore = totalPossibleCompletions > 0 
      ? Math.round((actualCompletions / totalPossibleCompletions) * 100) 
      : 0

    // Habit completions over the last 7 days for a line chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split("T")[0]
    }).reverse()

    const habitCompletionsByDay = last7Days.map(dayStr => {
      const count = habits.reduce((acc, h) => {
        const completedOnDay = h.history.some(hist => 
          hist.status === "COMPLETED" && hist.date.toISOString().split("T")[0] === dayStr
        )
        return acc + (completedOnDay ? 1 : 0)
      }, 0)
      
      return {
        day: new Date(dayStr).toLocaleDateString(undefined, { weekday: "short" }),
        completions: count,
      }
    })

    return NextResponse.json({
      goals: {
        total: totalGoals,
        completed: completedGoals,
        active: activeGoals,
        averageProgress,
        byCategory: goalsByCategory,
        byPriority: goalsByPriority,
      },
      habits: {
        total: totalHabits,
        active: activeHabits,
        averageStreak,
        bestStreak,
        consistencyScore,
        completionsByDay: habitCompletionsByDay,
      }
    })
  } catch (error) {
    console.error("[STATS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
