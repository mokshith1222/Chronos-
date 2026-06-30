"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useWorkspaceStore } from "@/stores/workspace-store"

// Global Fetch Interceptor to dynamically route requests to the user's private workspace
if (typeof window !== "undefined") {
  const originalFetch = window.fetch
  window.fetch = async function (input, init) {
    let workspaceId = null
    try {
      const stored = localStorage.getItem("chronos-workspace-store-v1")
      if (stored) {
        workspaceId = JSON.parse(stored).state?.workspaceId
      }
    } catch (e) {
      console.error("Failed to parse workspace store from localStorage:", e)
    }

    // If we have a custom workspace, rewrite the placeholder ID
    if (workspaceId) {
      let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url

      if (url.includes("cm0q9z8x0000008l4f1h7a3n2")) {
        url = url.replace(/cm0q9z8x0000008l4f1h7a3n2/g, workspaceId)
      }

      const newInit = { ...init }
      if (newInit && newInit.body && typeof newInit.body === "string") {
        if (newInit.body.includes("cm0q9z8x0000008l4f1h7a3n2")) {
          newInit.body = newInit.body.replace(/cm0q9z8x0000008l4f1h7a3n2/g, workspaceId)
        }
      }

      if (input instanceof Request) {
        const newRequest = new Request(url, {
          method: input.method,
          headers: input.headers,
          body: input.body,
          referrer: input.referrer,
          referrerPolicy: input.referrerPolicy,
          mode: input.mode,
          credentials: input.credentials,
          cache: input.cache,
          redirect: input.redirect,
          integrity: input.integrity,
          keepalive: input.keepalive,
          signal: input.signal,
        })
        return originalFetch(newRequest, init)
      }

      return originalFetch(url, newInit)
    }

    return originalFetch(input, init)
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const initializeWorkspace = useWorkspaceStore((state) => state.initializeWorkspace)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    initializeWorkspace().then(() => {
      setIsInitialized(true)
    })
  }, [initializeWorkspace])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Wait until the unique workspace is loaded/generated before booting the app.
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Initializing your secure workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
