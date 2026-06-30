"use client"

import { useCalendarStore } from "@/stores/calendar-store"
import { useCalendarEvents } from "@/hooks/use-calendar-queries"
import { cn } from "@/lib/utils"
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format } from "date-fns"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 60 // pixels per hour

export function CalendarWeekView() {
  const { selectedDate, setSelectedEventId } = useCalendarStore()
  const currentWeekDate = new Date(selectedDate)

  const startDate = startOfWeek(currentWeekDate)
  const endDate = endOfWeek(currentWeekDate)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Query events for the visible week range
  const { data: events } = useCalendarEvents({
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  })

  const getEventsForDay = (day: Date) => {
    return (events || []).filter((event: any) => isSameDay(new Date(event.startTime), day) && !event.isAllDay)
  }

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
      {/* Week headers */}
      <div className="grid grid-cols-[60px_1fr] border-b bg-muted/30">
        <div className="border-r py-3"></div>
        <div className="grid grid-cols-7 text-center py-2 text-xs font-semibold">
          {days.map((day, idx) => {
            const isToday = isSameDay(day, new Date())
            return (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">{format(day, "eee")}</span>
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center font-bold",
                  isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"
                )}>
                  {format(day, "d")}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Grid container */}
      <div className="flex-1 overflow-y-auto relative flex">
        {/* Hour labels column */}
        <div className="w-[60px] border-r shrink-0 select-none bg-muted/5">
          {HOURS.map((hour) => (
            <div 
              key={hour} 
              className="text-[10px] text-muted-foreground/80 font-medium text-right pr-2.5 relative"
              style={{ height: `${HOUR_HEIGHT}px`, top: "-6px" }}
            >
              {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Days hourly columns */}
        <div className="flex-1 grid grid-cols-7 relative h-[1440px]">
          {/* Vertical grid lines */}
          {days.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(day)

            return (
              <div key={dayIdx} className="border-r last:border-r-0 relative h-full">
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
                      className="absolute left-1 right-1 rounded-lg px-2 py-1 text-[11px] font-bold text-white border transition-all hover:scale-[1.01] hover:shadow-md z-10 cursor-pointer shadow-sm"
                      style={{
                        ...pos,
                        backgroundColor: event.color || "var(--primary)",
                        borderColor: event.color || "var(--primary)",
                      }}
                    >
                      <div className="truncate">{event.title}</div>
                      <div className="text-[9px] opacity-90 font-medium mt-0.5">
                        {format(new Date(event.startTime), "h:mm a")}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
