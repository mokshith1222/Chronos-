import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WorkspaceState {
  workspaceId: string | null
  userId: string | null
  setWorkspace: (workspaceId: string, userId?: string) => void
  clearWorkspace: () => void
  initializeWorkspace: () => Promise<string>
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaceId: null,
      userId: null,
      setWorkspace: (workspaceId, userId) => set({ workspaceId, userId: userId || null }),
      clearWorkspace: () => set({ workspaceId: null, userId: null }),
      initializeWorkspace: async () => {
        const state = get()
        if (state.workspaceId) {
          // Verify if it still exists
          try {
            const res = await fetch(`/api/workspaces/init?workspaceId=${state.workspaceId}`)
            if (res.ok) {
              const data = await res.json()
              return data.workspaceId
            }
          } catch (e) {
            console.error("Failed to verify workspace:", e)
          }
          return state.workspaceId
        }

        // Create new anonymous workspace
        try {
          const res = await fetch("/api/workspaces/init", { method: "POST" })
          if (res.ok) {
            const data = await res.json()
            set({ workspaceId: data.workspaceId, userId: data.userId })
            return data.workspaceId
          }
        } catch (e) {
          console.error("Failed to initialize workspace:", e)
        }
        return "default-workspace"
      },
    }),
    {
      name: "chronos-workspace-store-v1",
    }
  )
)
