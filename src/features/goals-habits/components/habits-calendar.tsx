"use client"

import * as React from "react"
import { useGetHabitsQuery } from "@/hooks/use-goals-queries"
import { Calendar as CalendarIcon, Info } from "lucide-react"

export function HabitsCalendar() {
  const { data: habits } = useGetHabitsQuery()

  // Generate last 180 days grouped by weeks (about 26 weeks)
  const calendarGrid = React.useMemo(() => {
    const grid: Date[][] = []
    const today = new Date()
    
    // Find the starting day: 24 weeks ago, aligned to Monday (1)
    const startDate = new Date()
    startDate.setDate(today.getDate() - 24 * 7)
    const startDayOfWeek = startDate.getDay() // 0 is Sun, 1 is Mon
    const daysToSubtract = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
    startDate.setDate(startDate.getDate() - daysToSubtract)

    let current = new Date(startDate)
    let currentWeek: Date[] = []

    while (current <= today) {
      currentWeek.push(new Date(current))
      
      if (currentWeek.length === 7) {
        grid.push(currentWeek)
        currentWeek = []
      }
      
      current.setDate(current.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      // Pad the last week if it's incomplete
      while (currentWeek.length < 7) {
        const nextDay = new Date(currentWeek[currentWeek.length - 1])
        nextDay.setDate(nextDay.getDate() + 1)
        currentWeek.push(nextDay)
      }
      grid.push(currentWeek)
    }

    return grid
  }, [])

  // Helper to format a local Date object as YYYY-MM-DD without timezone shifting
  const getLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Calculate completions per day
  const completionsMap = React.useMemo(() => {
    const map: Record<string, number> = {}
    if (!habits) return map

    habits.forEach((habit) => {
      habit.history.forEach((hist) => {
        if (hist.status === "COMPLETED") {
          // Keep the raw YYYY-MM-DD string from database
          const dateStr = hist.date.toString().split("T")[0]
          map[dateStr] = (map[dateStr] || 0) + 1
        }
      })
    })

    return map
  }, [habits])

  // Get color based on completion count
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-muted/20 dark:bg-muted/10 hover:bg-muted/40"
    if (count === 1) return "bg-primary/20 hover:bg-primary/30 text-primary-foreground"
    if (count === 2) return "bg-primary/40 hover:bg-primary/50 text-primary-foreground"
    if (count === 3) return "bg-primary/70 hover:bg-primary/80 text-primary-foreground"
    return "bg-primary hover:bg-primary/95 text-primary-foreground"
  }

  // Compute month labels with their column index offsets
  const monthLabels = React.useMemo(() => {
    const labels: { index: number; label: string }[] = []
    let lastMonth = -1

    calendarGrid.forEach((week, index) => {
      // Check the middle day of the week to avoid boundary edge cases
      const middleDay = week[3]
      const currentMonth = middleDay.getMonth()
      
      if (currentMonth !== lastMonth) {
        const monthName = middleDay.toLocaleDateString("en-US", { month: "short" })
        labels.push({ index, label: monthName })
        lastMonth = currentMonth
      }
    })

    return labels
  }, [calendarGrid])

  return (
    <div className="border bg-card p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <CalendarIcon className="size-5 text-primary" />
            Consistency Heatmap
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your habit completion density over the last 6 months.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
          <span>Less</span>
          <div className="size-2.5 rounded-sm bg-muted/20" />
          <div className="size-2.5 rounded-sm bg-primary/20" />
          <div className="size-2.5 rounded-sm bg-primary/40" />
          <div className="size-2.5 rounded-sm bg-primary/70" />
          <div className="size-2.5 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 -mx-6 px-6">
        <div className="flex flex-col min-w-[500px]">
          {/* Month Labels Row */}
          <div className="flex text-[9px] font-extrabold text-muted-foreground/50 h-4 mb-1 ml-8 relative select-none">
            {monthLabels.map((ml) => (
              <span
                key={ml.index}
                className="absolute"
                style={{
                  left: `calc(${ml.index} * 1rem)`, // 1rem = 16px which matches our column spacing (size-3 + gap-1)
                }}
              >
                {ml.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Weekday Labels (Aligned perfectly to the 7 rows using inline gridTemplateRows) */}
            <div 
              className="grid text-[9px] font-extrabold text-muted-foreground pr-2 h-[108px] select-none"
              style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
            >
              <span className="row-start-1 flex items-center">Mon</span>
              <span className="row-start-3 flex items-center">Wed</span>
              <span className="row-start-5 flex items-center">Fri</span>
              <span className="row-start-7 flex items-center">Sun</span>
            </div>

            {/* Heatmap Columns */}
            <div className="flex gap-1">
              {calendarGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const dateStr = getLocalYYYYMMDD(day)
                    const count = completionsMap[dateStr] || 0
                    const isFuture = day > new Date()
                    const formattedDate = day.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })

                    return (
                      <div
                        key={dateStr}
                        title={isFuture ? undefined : `${formattedDate}: ${count} habits completed`}
                        className={`size-3 rounded-sm transition-all duration-200 ${
                          isFuture 
                            ? "bg-muted/20 dark:bg-muted/10 opacity-30 cursor-default" 
                            : getCellColor(count)
                        }`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 mt-4 p-3 bg-muted/30 border border-border/50 rounded-xl text-xs text-muted-foreground">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <span>
          Habit consistency scores update in real time. Completed items boost your weekly consistency score and extend your streak!
        </span>
      </div>
    </div>
  )
}
