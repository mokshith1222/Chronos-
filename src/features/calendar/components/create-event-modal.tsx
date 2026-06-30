"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { calendarEventSchema, CalendarEventInput } from "@/lib/validations/calendar"
import { useCreateCalendarEvent } from "@/hooks/use-calendar-queries"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: Date
}

const PRESET_COLORS = [
  "hsl(var(--primary))",
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#d946ef", // fuchsia
]

export function CreateEventModal({ open, onOpenChange, initialDate }: CreateEventModalProps) {
  const createEvent = useCreateCalendarEvent()

  const getInitialDateTimeString = (date?: Date, hourOffset = 0) => {
    const d = date ? new Date(date) : new Date()
    if (!date) {
      d.setMinutes(0, 0, 0)
      d.setHours(d.getHours() + hourOffset)
    } else {
      d.setHours(9 + hourOffset, 0, 0)
    }
    // Format to yyyy-MM-ddThh:mm matching input datetime-local
    const tzOffset = d.getTimezoneOffset() * 60000
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
    return localISOTime
  }

  const form = useForm<CalendarEventInput>({
    resolver: zodResolver(calendarEventSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      startTime: getInitialDateTimeString(initialDate, 1),
      endTime: getInitialDateTimeString(initialDate, 2),
      location: "",
      color: PRESET_COLORS[0],
      isAllDay: false,
      type: "EVENT"
    }
  })

  const onSubmit = (data: CalendarEventInput) => {
    // Convert local datetime-local strings to ISO string for API
    const formattedData = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    }

    createEvent.mutate(formattedData, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Schedule a new event or time block in your calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              placeholder="e.g. Design Sync"
              {...form.register("title")}
              disabled={createEvent.isPending}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="datetime-local"
                {...form.register("startTime")}
                disabled={createEvent.isPending}
              />
              {form.formState.errors.startTime && (
                <p className="text-xs text-destructive">{form.formState.errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="datetime-local"
                {...form.register("endTime")}
                disabled={createEvent.isPending}
              />
              {form.formState.errors.endTime && (
                <p className="text-xs text-destructive">{form.formState.errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <Checkbox
              id="is-all-day"
              checked={form.watch("isAllDay")}
              onCheckedChange={(checked) => form.setValue("isAllDay", !!checked)}
              disabled={createEvent.isPending}
            />
            <Label htmlFor="is-all-day" className="text-xs cursor-pointer select-none">All-day Event</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Type</Label>
              <Select
                disabled={createEvent.isPending}
                value={form.watch("type")}
                onValueChange={(val: any) => form.setValue("type", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EVENT">Calendar Event</SelectItem>
                  <SelectItem value="TIME_BLOCK">Deep Work Block</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-loc">Location</Label>
              <Input
                id="event-loc"
                placeholder="e.g. Zoom, Meeting Room 1"
                {...form.register("location")}
                disabled={createEvent.isPending}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="event-desc">Description</Label>
            <Textarea
              id="event-desc"
              placeholder="Add notes or agenda..."
              rows={3}
              {...form.register("description")}
              disabled={createEvent.isPending}
            />
          </div>

          <div className="space-y-1">
            <Label>Color Code</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    form.watch("color") === color 
                      ? "border-primary scale-110 shadow-sm" 
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => form.setValue("color", color)}
                  disabled={createEvent.isPending}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createEvent.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEvent.isPending}>
              {createEvent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
