"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { calendarEventSchema, CalendarEventInput } from "@/lib/validations/calendar"
import { useCalendarEvent, useUpdateCalendarEvent, useDeleteCalendarEvent } from "@/hooks/use-calendar-queries"
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
import { Loader2, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface EditEventModalProps {
  eventId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRESET_COLORS = [
  "hsl(var(--primary))",
  "#ef4444", "#f97316", "#f59e0b", "#10b981", 
  "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef"
]

export function EditEventModal({ eventId, open, onOpenChange }: EditEventModalProps) {
  const { data: event, isLoading } = useCalendarEvent(eventId)
  const updateEvent = useUpdateCalendarEvent()
  const deleteEvent = useDeleteCalendarEvent()

  const getFormattedDateTimeString = (dateString?: string) => {
    if (!dateString) return ""
    const d = new Date(dateString)
    const tzOffset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
  }

  const form = useForm<CalendarEventInput>({
    resolver: zodResolver(calendarEventSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      color: PRESET_COLORS[0],
      isAllDay: false,
      type: "EVENT"
    }
  })

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description || "",
        startTime: getFormattedDateTimeString(event.startTime),
        endTime: getFormattedDateTimeString(event.endTime),
        location: event.location || "",
        color: event.color || PRESET_COLORS[0],
        isAllDay: event.isAllDay,
        type: event.type as any,
      })
    }
  }, [event, form])

  const onSubmit = (data: CalendarEventInput) => {
    if (!eventId) return
    const formattedData = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    }

    updateEvent.mutate({ id: eventId, data: formattedData }, {
      onSuccess: () => {
        onOpenChange(false)
      }
    })
  }

  const handleDelete = () => {
    if (!eventId) return
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        onOpenChange(false)
      }
    })
  }

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update or delete your calendar item.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="edit-event-title">Title</Label>
              <Input
                id="edit-event-title"
                placeholder="e.g. Design Sync"
                {...form.register("title")}
                disabled={updateEvent.isPending}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="edit-start-time">Start Time</Label>
                <Input
                  id="edit-start-time"
                  type="datetime-local"
                  {...form.register("startTime")}
                  disabled={updateEvent.isPending}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-end-time">End Time</Label>
                <Input
                  id="edit-end-time"
                  type="datetime-local"
                  {...form.register("endTime")}
                  disabled={updateEvent.isPending}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <Checkbox
                id="edit-is-all-day"
                checked={form.watch("isAllDay")}
                onCheckedChange={(checked) => form.setValue("isAllDay", !!checked, { shouldDirty: true })}
                disabled={updateEvent.isPending}
              />
              <Label htmlFor="edit-is-all-day" className="text-xs cursor-pointer select-none">All-day Event</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Type</Label>
                <Select
                  disabled={updateEvent.isPending}
                  value={form.watch("type")}
                  onValueChange={(val: any) => form.setValue("type", val, { shouldDirty: true })}
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
                <Label htmlFor="edit-event-loc">Location</Label>
                <Input
                  id="edit-event-loc"
                  placeholder="e.g. Zoom, Meeting Room 1"
                  {...form.register("location")}
                  disabled={updateEvent.isPending}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-event-desc">Description</Label>
              <Textarea
                id="edit-event-desc"
                placeholder="Add notes or agenda..."
                rows={3}
                {...form.register("description")}
                disabled={updateEvent.isPending}
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
                    onClick={() => form.setValue("color", color, { shouldDirty: true })}
                    disabled={updateEvent.isPending}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2 flex justify-between sm:justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={handleDelete}
                disabled={deleteEvent.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateEvent.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateEvent.isPending || !form.formState.isDirty}>
                  {updateEvent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
