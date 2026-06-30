"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { CheckCircle2, Circle } from "lucide-react"
import { useDashboardTasks } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentTasksWidget() {
  const { data: tasks, isLoading, isError } = useDashboardTasks()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !tasks) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load tasks
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
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent tasks</p>
            ) : (
              tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3 truncate pr-4">
                    {task.status === "DONE" ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    )}
                    <span className={`text-sm font-medium truncate ${task.status === "DONE" ? "text-muted-foreground line-through" : ""}`}>
                      {task.title}
                    </span>
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
