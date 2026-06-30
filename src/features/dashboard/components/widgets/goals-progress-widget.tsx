"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Target } from "lucide-react"
import { useDashboardGoals } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export function GoalsProgressWidget() {
  const { data: goals, isLoading, isError } = useDashboardGoals()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !goals) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load goals
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No active goals</p>
            ) : (
              goals.map((goal: any) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-4">{goal.title}</span>
                    <span className="text-muted-foreground shrink-0">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-1.5" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
