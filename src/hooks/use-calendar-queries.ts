import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CalendarEventInput, CalendarEventUpdateInput } from "@/lib/validations/calendar"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export function useCalendarEvents(filters?: { start?: string; end?: string; type?: string }) {
  return useQuery({
    queryKey: ["calendar-events", WORKSPACE_ID, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ workspaceId: WORKSPACE_ID })
      if (filters?.start) params.append("start", filters.start)
      if (filters?.end) params.append("end", filters.end)
      if (filters?.type && filters.type !== "ALL") params.append("type", filters.type)

      const res = await fetch(`/api/calendar/events?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch calendar events")
      return res.json()
    }
  })
}

export function useCalendarEvent(id: string | null) {
  return useQuery({
    queryKey: ["calendar-event", id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`/api/calendar/events/${id}`)
      if (!res.ok) throw new Error("Failed to fetch calendar event")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CalendarEventInput) => {
      const res = await fetch(`/api/calendar/events?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to create calendar event")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "calendar", WORKSPACE_ID] })
    }
  })
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CalendarEventUpdateInput }) => {
      const res = await fetch(`/api/calendar/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update calendar event")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["calendar-event", data.id] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "calendar", WORKSPACE_ID] })
    }
  })
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/calendar/events/${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete calendar event")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "calendar", WORKSPACE_ID] })
    }
  })
}
