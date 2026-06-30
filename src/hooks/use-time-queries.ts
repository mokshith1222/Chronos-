import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export function useActiveSession() {
  return useQuery({
    queryKey: ["time-session", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/time/session?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch active session")
      return res.json()
    }
  })
}

export function useTimeEntries(limit = 50) {
  return useQuery({
    queryKey: ["time-entries", WORKSPACE_ID, limit],
    queryFn: async () => {
      const res = await fetch(`/api/time/entries?workspaceId=${WORKSPACE_ID}&limit=${limit}`)
      if (!res.ok) throw new Error("Failed to fetch time entries")
      return res.json()
    }
  })
}

export function useTimeStats() {
  return useQuery({
    queryKey: ["time-stats", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/time/stats?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch time stats")
      return res.json()
    }
  })
}

export function useStartSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { projectId?: string | null; taskId?: string | null; type?: string; description?: string }) => {
      const res = await fetch(`/api/time/session?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to start session")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["time-session", WORKSPACE_ID], data)
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
    }
  })
}

export function useUpdateActiveSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      description?: string
      projectId?: string | null
      taskId?: string | null
      notes?: string
      mood?: number
      energyLevel?: number
      productivityRating?: number
      tags?: string
      isProductive?: boolean
    }) => {
      const res = await fetch(`/api/time/session?workspaceId=${WORKSPACE_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update session")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["time-session", WORKSPACE_ID], data)
    }
  })
}

export function useStopSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/time/session?workspaceId=${WORKSPACE_ID}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to stop session")
      return res.json()
    },
    onSuccess: () => {
      queryClient.setQueryData(["time-session", WORKSPACE_ID], null)
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
      queryClient.invalidateQueries({ queryKey: ["time-stats"] })
    }
  })
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      projectId?: string | null
      taskId?: string | null
      description?: string | null
      startTime: string
      endTime: string
      isProductive?: boolean
      type?: string
      notes?: string | null
      tags?: string | null
    }) => {
      const res = await fetch(`/api/time/entries?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to create manual entry")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
      queryClient.invalidateQueries({ queryKey: ["time-stats"] })
    }
  })
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/time/entries?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete time entry")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
      queryClient.invalidateQueries({ queryKey: ["time-stats"] })
    }
  })
}
