"use client"

import { useCalendarStore } from "@/stores/calendar-store"
import { useCalendarEvents } from "@/hooks/use-calendar-queries"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"
import { format, startOfDay, endOfDay } from "date-fns"

export function CalendarAgendaView() {
  const { selectedDate, setSelectedEventId } = useCalendarStore()
  const day = new Date(selectedDate)

  // Query events starting from the selected date to 7 days in the future
  const start = startOfDay(day)
  const end = endOfDay(new Date(day.getTime() + 7 * 24 * 60 * 60 * 1000))

  const { data: events, isLoading } = useCalendarEvents({
    start: start.toISOString(),
    end: end.toISOString(),
  })

  if (isLoading) {
    return (
      <div className="space-y-3 py-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 border rounded-xl animate-pulse bg-muted/20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 py-4 min-h-[600px]">
      {(!events || events.length === 0) ? (
        <div className="py-20 text-center text-muted-foreground border rounded-xl border-dashed">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No upcoming events scheduled for this week.</p>
        </div>
      ) : (
        events.map((event: any) => (
          <Card 
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            className="group cursor-pointer hover:border-primary/40 transition-colors border-border/60 bg-card/60 backdrop-blur-sm"
          >
            <CardContent className="p-4 flex gap-4 items-start">
              <div 
                className="w-2 h-12 rounded-full shrink-0"
                style={{ backgroundColor: event.color || "var(--primary)" }}
              />
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {event.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(event.startTime), "MMM d, h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
