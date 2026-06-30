"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Calendar as CalendarIcon } from "lucide-react"
import { useDashboardCalendar } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function CalendarWidget() {
  const { data: events, isLoading, isError } = useDashboardCalendar()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !events) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load calendar
        </CardContent>
      </Card>
    )
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No events today</p>
            ) : (
              events.map((event: any) => (
                <div key={event.id} className="flex gap-4 items-start">
                  <div className="flex flex-col items-end shrink-0 w-16">
                    <span className="text-sm font-medium">{formatTime(event.startTime)}</span>
                  </div>
                  <div className="flex flex-col border-l-2 border-primary pl-3">
                    <span className="text-sm font-medium truncate">{event.title}</span>
                    {event.location && (
                      <span className="text-xs text-muted-foreground truncate">{event.location}</span>
                    )}
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
