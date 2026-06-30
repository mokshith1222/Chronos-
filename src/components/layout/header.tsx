"use client"

import * as React from "react"
import { Search, Menu, Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationDrawer } from "@/components/global/notification-drawer"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSearchStore } from "@/stores/search-store"

const themesList = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
  { id: "aurora", name: "Aurora" },
  { id: "ocean", name: "Ocean" },
  { id: "sunset", name: "Sunset" },
  { id: "forest", name: "Forest" },
  { id: "lavender", name: "Lavender" },
  { id: "midnight", name: "Midnight" },
  { id: "glass", name: "Glass" },
]

const accentsList = [
  { id: "blue", name: "Blue", color: "oklch(0.6 0.18 250)" },
  { id: "purple", name: "Purple", color: "oklch(0.65 0.2 290)" },
  { id: "emerald", name: "Emerald", color: "oklch(0.7 0.18 140)" },
  { id: "cyan", name: "Cyan", color: "oklch(0.7 0.16 190)" },
  { id: "orange", name: "Orange", color: "oklch(0.7 0.18 45)" },
  { id: "rose", name: "Rose", color: "oklch(0.65 0.2 15)" },
  { id: "pink", name: "Pink", color: "oklch(0.65 0.22 330)" },
  { id: "indigo", name: "Indigo", color: "oklch(0.55 0.2 270)" },
  { id: "lime", name: "Lime", color: "oklch(0.78 0.18 115)" },
  { id: "gold", name: "Gold", color: "oklch(0.78 0.12 80)" },
]

export function Header() {
  const { setTheme, theme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const [accent, setAccent] = React.useState("blue")
  const pathname = usePathname()
  const { setIsOpen } = useSearchStore()

  // Apply accent on mount
  React.useEffect(() => {
    const savedAccent = localStorage.getItem("chronos-accent") || "blue"
    setAccent(savedAccent)
    document.documentElement.className = document.documentElement.className
      .split(" ")
      .filter((c) => !c.startsWith("accent-"))
      .join(" ")
    document.documentElement.classList.add(`accent-${savedAccent}`)
  }, [])

  // Sync theme class and apply 'dark' class for dark-based custom themes
  React.useEffect(() => {
    if (!theme) return
    const themes = ["light", "dark", "aurora", "ocean", "sunset", "forest", "lavender", "midnight", "glass"]
    document.documentElement.classList.remove(...themes)
    document.documentElement.classList.add(theme)

    const darkThemes = ["dark", "aurora", "ocean", "sunset", "forest", "midnight", "glass"]
    if (darkThemes.includes(theme)) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // Auto-close mobile sidebar sheet on route change
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleAccentChange = (newAccent: string) => {
    setAccent(newAccent)
    localStorage.setItem("chronos-accent", newAccent)
    document.documentElement.className = document.documentElement.className
      .split(" ")
      .filter((c) => !c.startsWith("accent-"))
      .join(" ")
    document.documentElement.classList.add(`accent-${newAccent}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b border-border/10 bg-background/30 px-6 backdrop-blur-2xl transition-all duration-300">
      <div className="flex flex-1 items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-muted-foreground hover:text-foreground -ml-2"
              aria-label="Open menu"
            />
          }>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-background/95 backdrop-blur-xl h-full border-r border-border/20">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Search Bar / Command Trigger */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            readOnly
            onClick={() => setIsOpen(true)}
            placeholder="Search anywhere... (Cmd+K)"
            className="flex h-10 w-full rounded-xl border border-border/40 bg-card/40 px-4 py-1 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary pl-10 cursor-text hover:border-primary/25"
          />
        </div>
      </div>

      {/* Actions & Customizers */}
      <div className="flex items-center gap-3">
        <NotificationDrawer />
        
        {/* Premium Theme & Accent Customizer */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
              aria-label="Customize Workspace Theme"
            />
          }>
            <Palette className="size-4.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-4 bg-card/85 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Select Theme
            </div>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "text-xs py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer",
                    theme === t.id
                      ? "bg-primary/15 text-primary border-primary/30 font-semibold shadow-sm"
                      : "hover:bg-primary/5 border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
            
            <DropdownMenuSeparator className="bg-border/25 my-3" />
            
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Select Accent
            </div>
            <div className="grid grid-cols-5 gap-2">
              {accentsList.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleAccentChange(acc.id)}
                  className={cn(
                    "size-6 rounded-full border flex items-center justify-center transition-all relative cursor-pointer",
                    accent === acc.id 
                      ? "border-foreground scale-110 shadow-[0_0_12px_rgba(0,0,0,0.15)]" 
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: acc.color }}
                  title={acc.name}
                  aria-label={`Set accent color to ${acc.name}`}
                >
                  {accent === acc.id && <Check className="size-3 text-white mix-blend-difference" />}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
