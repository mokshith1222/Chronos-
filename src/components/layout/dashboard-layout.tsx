"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { CommandPalette } from "@/components/global/command-palette"
import { QuickAddModal } from "@/components/global/quick-add-modal"
import { TimerTicker } from "@/components/global/timer-ticker"
import { useZenMode } from "@/hooks/use-zen"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useIntegration } from "@/hooks/use-integration"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts()
  useIntegration()
  const { isZenMode, toggleZenMode } = useZenMode()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle on 'z' or 'Z' when not in an input
      if (e.key.toLowerCase() === 'z' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        toggleZenMode()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggleZenMode])
  return (
    <div className={cn("flex min-h-screen w-full bg-background selection:bg-primary/20 transition-all duration-500 relative overflow-hidden", isZenMode && "grayscale brightness-95")}>
      {/* Aurora Background Blobs */}
      {!isZenMode && (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/8 blur-[130px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/8 blur-[130px] animate-blob animation-delay-2000" />
          <div className="absolute top-[30%] right-[20%] w-[45%] h-[45%] rounded-full bg-cyan-500/5 blur-[120px] animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-noise opacity-[0.012] mix-blend-overlay" />
        </div>
      )}

      {!isZenMode && <Sidebar />}
      <div className={cn("flex flex-1 flex-col transition-all duration-500", !isZenMode ? "md:pl-[288px]" : "pl-0")}>
        {!isZenMode && <Header />}
        <main className="flex-1 p-6 md:p-8 lg:p-10 animate-in fade-in duration-700 slide-in-from-bottom-4">
          {children}
        </main>
      </div>
      <TimerTicker />
      <CommandPalette />
      <QuickAddModal />
      <Toaster position="bottom-right" />
    </div>
  )
}
