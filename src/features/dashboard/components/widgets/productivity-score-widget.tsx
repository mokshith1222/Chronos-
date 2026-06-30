"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { widgetHover } from "@/lib/animations"
import { Activity } from "lucide-react"
import { useDashboardOverview } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductivityScoreWidget() {
  const { data, isLoading, isError } = useDashboardOverview()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-16 mb-4" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load score
        </CardContent>
      </Card>
    )
  }

  const { productivityScore, totalHoursToday } = data

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Activity size={120} />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{productivityScore}%</div>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            {totalHoursToday} hours focused today
          </p>
          <Progress value={productivityScore} className="h-2" />
        </CardContent>
      </Card>
    </motion.div>
  )
}
