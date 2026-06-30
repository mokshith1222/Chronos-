"use client"

import { useCalendarStore } from "@/stores/calendar-store"
import { useCalendarEvents } from "@/hooks/use-calendar-queries"
import { cn } from "@/lib/utils"
import { isSameDay, format } from "date-fns"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 70 // slightly taller for single day view

export function CalendarDayView() {
  const { selectedDate, setSelectedEventId } = useCalendarStore()
  const day = new Date(selectedDate)

  // Query events for the selected day range
  const startOfDay = new Date(day)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(day)
  endOfDay.setHours(23, 59, 59, 999)

  const { data: events } = useCalendarEvents({
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
  })

  const dayEvents = (events || []).filter((event: any) => !event.isAllDay)

  const getEventPosition = (event: any) => {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    
    const startHours = start.getHours() + start.getMinutes() / 60
    const endHours = end.getHours() + end.getMinutes() / 60
    const duration = endHours - startHours

    return {
      top: `${startHours * HOUR_HEIGHT}px`,
      height: `${Math.max(0.5, duration) * HOUR_HEIGHT}px`,
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-xl bg-card overflow-hidden">
      {/* Day header */}
      <div className="border-b bg-muted/30 p-4 text-center">
        <h2 className="text-lg font-bold text-foreground">
          {format(day, "EEEE, MMMM d, yyyy")}
        </h2>
      </div>

      {/* Grid container */}
      <div className="flex-1 overflow-y-auto relative flex">
        {/* Hour labels column */}
        <div className="w-[70px] border-r shrink-0 select-none bg-muted/5">
          {HOURS.map((hour) => (
            <div 
              key={hour} 
              className="text-[11px] text-muted-foreground/80 font-semibold text-right pr-3.5 relative"
              style={{ height: `${HOUR_HEIGHT}px`, top: "-6px" }}
            >
              {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Single day hourly column */}
        <div className="flex-1 relative h-[1680px]">
          {/* Horizontal hour helper lines */}
          {HOURS.map((hour) => (
            <div 
              key={hour} 
              className="border-b border-border/40 w-full" 
              style={{ height: `${HOUR_HEIGHT}px` }} 
            />
          ))}

          {/* Absolute positioned events */}
          {dayEvents.map((event: any) => {
            const pos = getEventPosition(event)
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className="absolute left-4 right-4 rounded-xl px-4 py-3 text-xs font-bold text-white border transition-all hover:scale-[1.005] hover:shadow-lg z-10 cursor-pointer shadow-md flex flex-col justify-between"
                style={{
                  ...pos,
                  backgroundColor: event.color || "var(--primary)",
                  borderColor: event.color || "var(--primary)",
                }}
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm truncate">{event.title}</div>
                  {event.description && (
                    <div className="text-[10px] opacity-90 font-normal line-clamp-2">{event.description}</div>
                  )}
                </div>
                <div className="text-[10px] opacity-90 font-semibold flex justify-between items-center mt-2">
                  <span>{format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}</span>
                  {event.location && <span className="opacity-75">{event.location}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
