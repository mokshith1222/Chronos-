"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Flame } from "lucide-react"
import { useDashboardHabits } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function HabitProgressWidget() {
  const { data: habits, isLoading, isError } = useDashboardHabits()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !habits) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load habits
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Daily Habits</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {habits.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 col-span-2">No habits tracked</p>
            ) : (
              habits.map((habit: any) => (
                <div key={habit.id} className="flex flex-col p-3 rounded-lg border bg-card text-card-foreground">
                  <span className="text-xs font-medium truncate mb-1">{habit.title}</span>
                  <div className="flex items-center gap-1 mt-auto">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-bold">{habit.streak} day streak</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
