import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TaskInput, TaskUpdateInput, TaskReorderInput } from "@/lib/validations/task"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export function useTasks(filters?: { projectId?: string | null; showArchived?: boolean }) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ["tasks", WORKSPACE_ID, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ workspaceId: WORKSPACE_ID })
      if (filters?.projectId) params.append("projectId", filters.projectId)
      if (filters?.showArchived) params.append("showArchived", "true")
      
      const res = await fetch(`/api/tasks?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch tasks")
      return res.json()
    }
  })
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`/api/tasks/${id}`)
      if (!res.ok) throw new Error("Failed to fetch task")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: TaskInput) => {
      const res = await fetch(`/api/tasks?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to create task")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "tasks", WORKSPACE_ID] })
    }
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdateInput }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update task")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["task", data.id] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "tasks", WORKSPACE_ID] })
    }
  })
}

export function useReorderTasks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: TaskReorderInput) => {
      const res = await fetch(`/api/tasks/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to reorder tasks")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
    }
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete task")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "tasks", WORKSPACE_ID] })
    }
  })
}

export function useCreateChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      const res = await fetch(`/api/tasks/${taskId}/checklists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      })
      if (!res.ok) throw new Error("Failed to create checklist item")
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
    }
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, itemId, isCompleted }: { taskId: string; itemId: string; isCompleted: boolean }) => {
      const res = await fetch(`/api/tasks/${taskId}/checklists?itemId=${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted })
      })
      if (!res.ok) throw new Error("Failed to toggle checklist item")
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
    }
  })
}

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, itemId }: { taskId: string; itemId: string }) => {
      const res = await fetch(`/api/tasks/${taskId}/checklists?itemId=${itemId}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete checklist item")
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks", WORKSPACE_ID] })
    }
  })
}

