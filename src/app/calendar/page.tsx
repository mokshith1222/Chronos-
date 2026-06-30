"use client"

import { useState, useEffect } from "react"
import { useCalendarStore, CalendarViewMode } from "@/stores/calendar-store"
import { CalendarMonthView } from "@/features/calendar/components/views/calendar-month-view"
import { CalendarWeekView } from "@/features/calendar/components/views/calendar-week-view"
import { CalendarDayView } from "@/features/calendar/components/views/calendar-day-view"
import { CalendarAgendaView } from "@/features/calendar/components/views/calendar-agenda-view"
import { DailyPlanner } from "@/features/calendar/components/daily-planner"
import { CreateEventModal } from "@/features/calendar/components/create-event-modal"
import { EditEventModal } from "@/features/calendar/components/edit-event-modal"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format } from "date-fns"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function CalendarPage() {
  const {
    selectedDate,
    viewMode,
    setViewMode,
    nextDate,
    previousDate,
    setToday,
    selectedEventId,
    setSelectedEventId,
  } = useCalendarStore()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createInitialDate, setCreateInitialDate] = useState<Date | undefined>(undefined)

  const handleDayClick = (date: Date) => {
    setCreateInitialDate(date)
    setIsCreateOpen(true)
  }

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case "t":
          setToday()
          break
        case "m":
          setViewMode("month")
          break
        case "w":
          setViewMode("week")
          break
        case "d":
          setViewMode("day")
          break
        case "a":
          setViewMode("agenda")
          break
        case "c":
          setCreateInitialDate(undefined)
          setIsCreateOpen(true)
          break
        case "arrowright":
          nextDate()
          break
        case "arrowleft":
          previousDate()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setToday, setViewMode, nextDate, previousDate])

  const renderActiveView = () => {
    switch (viewMode) {
      case "month":
        return <CalendarMonthView onDayClick={handleDayClick} />
      case "week":
        return <CalendarWeekView />
      case "day":
        return <CalendarDayView />
      case "agenda":
        return <CalendarAgendaView />
    }
  }

  const viewToggles: { id: CalendarViewMode; label: string }[] = [
    { id: "month", label: "Month" },
    { id: "week", label: "Week" },
    { id: "day", label: "Day" },
    { id: "agenda", label: "Agenda" },
  ]

  const formattedHeaderDate = () => {
    const d = new Date(selectedDate)
    if (viewMode === "month") return format(d, "MMMM yyyy")
    if (viewMode === "week") {
      return `Week of ${format(d, "MMM d, yyyy")}`
    }
    return format(d, "MMMM d, yyyy")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Calendar</h1>
            <div className="flex items-center gap-1 bg-muted/50 border rounded-lg p-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={previousDate}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="h-7 text-xs px-2.5" onClick={setToday}>
                Today
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextDate}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm font-semibold text-foreground hidden sm:inline-block">
              {formattedHeaderDate()}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center p-0.5 bg-muted/50 rounded-lg border w-full md:w-auto overflow-x-auto">
              {viewToggles.map((toggle) => (
                <Button
                  key={toggle.id}
                  variant={viewMode === toggle.id ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 md:flex-initial h-7 text-xs px-3"
                  onClick={() => setViewMode(toggle.id)}
                >
                  {toggle.label}
                </Button>
              ))}
            </div>

            <Button size="sm" className="h-8 gap-1.5 shrink-0" onClick={() => handleDayClick(new Date())}>
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>

        <main className="flex-1 w-full mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Calendar Grid */}
            <div className="xl:col-span-3">
              <div className="sm:hidden text-center mb-4 font-bold text-base">
                {formattedHeaderDate()}
              </div>
              {renderActiveView()}
            </div>

            {/* Daily Planner Sidebar */}
            <div className="xl:col-span-1">
              <DailyPlanner />
            </div>
          </div>
        </main>
      </div>

      {/* Event Modals */}
      <CreateEventModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialDate={createInitialDate}
      />

      <EditEventModal
        eventId={selectedEventId}
        open={!!selectedEventId}
        onOpenChange={(open) => !open && setSelectedEventId(null)}
      />
    </DashboardLayout>
  )
}
