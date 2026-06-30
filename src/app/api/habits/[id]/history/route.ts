import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params
    const body = await req.json()
    const { date, status, count, notes } = body

    if (!date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 })
    }

    // Normalize date to YYYY-MM-DD 00:00:00 UTC
    const targetDate = new Date(date)
    targetDate.setUTCHours(0, 0, 0, 0)

    const habit = await db.habit.findUnique({
      where: { id: habitId },
    })

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    // Toggle logic: if it already exists and status is COMPLETED, and we send status=COMPLETED, we delete it (untoggle)
    // Otherwise we create or update it.
    const existingHistory = await db.habitHistory.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: targetDate,
        },
      },
    })

    if (existingHistory && status === "DELETE") {
      await db.habitHistory.delete({
        where: { id: existingHistory.id },
      })
    } else if (existingHistory) {
      await db.habitHistory.update({
        where: { id: existingHistory.id },
        data: {
          status: status || "COMPLETED",
          count: count !== undefined ? parseInt(count) : existingHistory.count,
          notes: notes !== undefined ? notes : existingHistory.notes,
        },
      })
    } else {
      await db.habitHistory.create({
        data: {
          habitId,
          date: targetDate,
          status: status || "COMPLETED",
          count: count !== undefined ? parseInt(count) : 1,
          notes,
        },
      })
    }

    // Fetch all history for this habit to recalculate streaks
    const allHistory = await db.habitHistory.findMany({
      where: {
        habitId,
        status: "COMPLETED",
      },
      orderBy: {
        date: "asc",
      },
    })

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(allHistory.map(h => h.date))

    // Update habit with new streaks
    const updatedHabit = await db.habit.update({
      where: { id: habitId },
      data: {
        currentStreak,
        longestStreak,
      },
      include: {
        history: {
          orderBy: {
            date: "desc",
          },
        },
      },
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    console.error("[HABIT_HISTORY_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateStreaks(dates: Date[]): { currentStreak: number; longestStreak: number } {
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Normalize dates to local YYYY-MM-DD strings for comparison
  const dateStrings = Array.from(
    new Set(
      dates.map(d => {
        const dateObj = new Date(d)
        return dateObj.toISOString().split("T")[0]
      })
    )
  ).sort()

  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0

  // 1. Calculate longest streak
  for (let i = 0; i < dateStrings.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prevDate = new Date(dateStrings[i - 1])
      const currDate = new Date(dateStrings[i])
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        tempStreak++
      } else if (diffDays > 1) {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  // 2. Calculate current streak
  // Get today's and yesterday's date strings in UTC/local
  const todayObj = new Date()
  const todayStr = todayObj.toISOString().split("T")[0]
  
  const yesterdayObj = new Date()
  yesterdayObj.setDate(yesterdayObj.getDate() - 1)
  const yesterdayStr = yesterdayObj.toISOString().split("T")[0]

  const hasCompletedToday = dateStrings.includes(todayStr)
  const hasCompletedYesterday = dateStrings.includes(yesterdayStr)

  if (!hasCompletedToday && !hasCompletedYesterday) {
    currentStreak = 0
  } else {
    // Start counting backwards from the most recent completed day (today or yesterday)
    let checkDate = hasCompletedToday ? todayObj : yesterdayObj
    let checkStr = checkDate.toISOString().split("T")[0]
    
    while (dateStrings.includes(checkStr)) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
      checkStr = checkDate.toISOString().split("T")[0]
    }
  }

  return { currentStreak, longestStreak }
}
