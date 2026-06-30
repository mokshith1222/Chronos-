"use client"

import { Search } from "lucide-react"
import { useSearchStore } from "@/stores/search-store"

export function DashboardSearch() {
  const { setIsOpen } = useSearchStore()

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        readOnly
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-full rounded-xl border border-border/40 bg-card/40 py-1 pl-9 pr-12 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary hover:border-primary/25 bg-background/50 cursor-text"
        placeholder="Search widgets..."
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <kbd className="inline-flex items-center rounded-lg border border-border/60 bg-muted/80 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
          <span className="text-xs mr-0.5">⌘</span>K
        </kbd>
      </div>
    </div>
  )
}
