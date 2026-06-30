import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface UserProfile {
  id: string
  name: string | null
  email: string
}

export function useUser() {
  return useQuery<UserProfile>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user")
      if (!res.ok) throw new Error("Failed to fetch user profile")
      return res.json()
    }
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update user profile")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    }
  })
}
