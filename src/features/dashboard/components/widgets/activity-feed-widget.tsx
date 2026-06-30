"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { ActivitySquare } from "lucide-react"
import { useDashboardActivity } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function ActivityFeedWidget() {
  const { data: activityLogs, isLoading, isError } = useDashboardActivity()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !activityLogs) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load activity
        </CardContent>
      </Card>
    )
  }

  const timeAgo = (isoString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const diff = (new Date(isoString).getTime() - new Date().getTime()) / 1000
    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second')
    if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute')
    if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
    return rtf.format(Math.round(diff / 86400), 'day')
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0 shrink-0">
          <CardTitle className="text-sm font-medium">Activity Feed</CardTitle>
          <ActivitySquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {activityLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              activityLogs.map((log: any) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-background bg-muted text-muted-foreground group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0.5 md:ml-0" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{log.action}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(log.createdAt)}</span>
                    </div>
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
