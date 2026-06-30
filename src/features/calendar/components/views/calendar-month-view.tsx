"use client"

import { useCalendarStore } from "@/stores/calendar-store"
import { useCalendarEvents } from "@/hooks/use-calendar-queries"
import { cn } from "@/lib/utils"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, format } from "date-fns"

interface CalendarMonthViewProps {
  onDayClick: (date: Date) => void
}

export function CalendarMonthView({ onDayClick }: CalendarMonthViewProps) {
  const { selectedDate, setSelectedEventId } = useCalendarStore()
  const currentMonthDate = new Date(selectedDate)

  const monthStart = startOfMonth(currentMonthDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Query events for the visible month range
  const { data: events } = useCalendarEvents({
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  })

  const getEventsForDay = (day: Date) => {
    return (events || []).filter((event: any) => isSameDay(new Date(event.startTime), day))
  }

  return (
    <div className="flex flex-col h-full min-h-[600px] border rounded-xl overflow-hidden bg-card">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30 text-center py-2.5 text-xs font-semibold text-muted-foreground">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonthDate)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={idx}
              onClick={() => onDayClick(day)}
              className={cn(
                "border-r border-b last:border-r-0 p-1.5 flex flex-col min-h-[100px] transition-colors duration-150 cursor-pointer hover:bg-accent/20",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground/60"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={cn(
                    "text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center",
                    isToday && "bg-primary text-primary-foreground shadow-sm",
                    !isToday && isCurrentMonth && "text-foreground",
                    !isToday && !isCurrentMonth && "text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px]">
                {dayEvents.slice(0, 3).map((event: any) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEventId(event.id)
                    }}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded truncate text-white border transition-all hover:brightness-95 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: event.color || "var(--primary)",
                      borderColor: event.color || "var(--primary)" 
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[9px] text-muted-foreground font-semibold px-1">
                    + {dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
