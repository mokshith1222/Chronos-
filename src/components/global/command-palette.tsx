"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useTimerStore } from "@/stores/timer-store"
import { useSearchStore } from "@/stores/search-store"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import {
  Clock,
  CheckSquare,
  Folder,
  LayoutDashboard,
  Target,
  Activity,
  FileText,
  Calendar,
  Settings,
  Sun,
  Moon,
  Play,
  Square,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export function CommandPalette() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const { isOpen, setIsOpen, query, setQuery, filterType, setFilterType } = useSearchStore()
  const { isRunning, startTimer, stopTimer } = useTimerStore()

  const [results, setResults] = React.useState<any>({
    projects: [],
    tasks: [],
    notes: [],
    goals: [],
    habits: [],
    calendarEvents: [],
  })
  const [loading, setLoading] = React.useState(false)
  const [highlightedItem, setHighlightedItem] = React.useState<any>(null)

  // 1. Fetch Search Results
  React.useEffect(() => {
    if (!isOpen) return
    if (!query.trim()) {
      setResults({
        projects: [],
        tasks: [],
        notes: [],
        goals: [],
        habits: [],
        calendarEvents: [],
      })
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      try {
        const typeParam = filterType ? `&type=${filterType}` : ""
        const res = await fetch(`/api/search?workspaceId=cm0q9z8x0000008l4f1h7a3n2&q=${encodeURIComponent(query)}${typeParam}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 150)

    return () => clearTimeout(delayDebounce)
  }, [query, isOpen, filterType])

  // 2. Track Highlighted Item via DOM selection
  const updateHighlighted = React.useCallback(() => {
    setTimeout(() => {
      const selectedEl = document.querySelector('[data-selected="true"]')
      if (selectedEl) {
        const id = selectedEl.getAttribute("data-id")
        const type = selectedEl.getAttribute("data-type")
        const title = selectedEl.getAttribute("data-title")
        
        if (id && type && title) {
          // Find full item details in results or commands
          let details = null
          if (type === "command") {
            details = COMMANDS.find((c) => c.id === id)
          } else {
            const list = results[type + "s"] || [] // e.g. tasks, notes
            details = list.find((item: any) => item.id === id)
          }
          setHighlightedItem({ id, type, title, details })
        }
      } else {
        setHighlightedItem(null)
      }
    }, 20)
  }, [results])

  React.useEffect(() => {
    if (isOpen) {
      updateHighlighted()
    }
  }, [isOpen, query, results, updateHighlighted])

  // Handle keyboard arrow navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        updateHighlighted()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [updateHighlighted])

  const runCommand = React.useCallback((action: () => unknown) => {
    setIsOpen(false)
    action()
  }, [setIsOpen])

  // Commands List
  const COMMANDS = [
    {
      id: "start-timer",
      title: "Start Focus Timer",
      description: "Start a standard time tracking session",
      icon: Play,
      action: () => startTimer("NORMAL"),
      shortcut: "⌥T",
      visible: !isRunning,
    },
    {
      id: "stop-timer",
      title: "Stop Focus Timer",
      description: "Stop the active time tracking session",
      icon: Square,
      action: () => stopTimer(),
      shortcut: "⌥T",
      visible: isRunning,
    },
    {
      id: "create-task",
      title: "Create New Task",
      description: "Quickly capture a task with natural language parsing",
      icon: CheckSquare,
      action: () => {
        // Trigger quick add task modal
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "a", metaKey: true, shiftKey: true }))
      },
      shortcut: "⌘⇧A",
      visible: true,
    },
    {
      id: "toggle-theme",
      title: "Toggle Theme",
      description: "Switch between light and dark mode",
      icon: theme === "light" ? Moon : Sun,
      action: () => setTheme(theme === "light" ? "dark" : "light"),
      shortcut: "⌘⇧D",
      visible: true,
    },
    {
      id: "open-reports",
      title: "Open Reports & Analytics",
      description: "View productivity index and charts",
      icon: FileText,
      action: () => router.push("/reports"),
      visible: true,
    },
    {
      id: "open-calendar",
      title: "Open Calendar",
      description: "View and schedule calendar events",
      icon: Calendar,
      action: () => router.push("/calendar"),
      visible: true,
    },
    {
      id: "open-settings",
      title: "Open Settings",
      description: "Configure profile and preferences",
      icon: Settings,
      action: () => router.push("/settings"),
      visible: true,
    },
  ]

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-3xl w-full h-[460px] flex flex-col bg-card/95 backdrop-blur-xl border shadow-2xl rounded-2xl overflow-hidden"
    >
      <CommandInput
        placeholder="Search everything or type a command... (e.g. /task, /note)"
        value={query}
        onValueChange={setQuery}
      />

      <div className="flex flex-1 overflow-hidden border-t">
        {/* Left Pane: Results List (60% width) */}
        <div className="w-[60%] border-r flex flex-col justify-between h-full">
          <CommandList className="flex-1 overflow-y-auto max-h-[360px] p-2 space-y-2">
            <CommandEmpty>No results found.</CommandEmpty>

            {/* Prefix suggestions */}
            {!query && (
              <CommandGroup heading="Search Filters">
                <CommandItem onSelect={() => setQuery("/task ")}>
                  <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Filter by Tasks</span>
                </CommandItem>
                <CommandItem onSelect={() => setQuery("/note ")}>
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Filter by Notes</span>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Actions/Commands Group */}
            <CommandGroup heading="Commands">
              {COMMANDS.filter(c => c.visible).map((cmd) => (
                <CommandItem
                  key={cmd.id}
                  data-id={cmd.id}
                  data-type="command"
                  data-title={cmd.title}
                  onSelect={() => runCommand(cmd.action)}
                >
                  <cmd.icon className="mr-2 h-4 w-4 text-primary" />
                  <span>{cmd.title}</span>
                  {cmd.shortcut && (
                    <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                      {cmd.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Projects Group */}
            {results.projects.length > 0 && (
              <CommandGroup heading="Projects">
                {results.projects.map((p: any) => (
                  <CommandItem
                    key={p.id}
                    data-id={p.id}
                    data-type="project"
                    data-title={p.name}
                    onSelect={() => runCommand(() => router.push(`/projects/${p.id}`))}
                  >
                    <Folder className="mr-2 h-4 w-4" style={{ color: p.color || undefined }} />
                    <span>{p.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Tasks Group */}
            {results.tasks.length > 0 && (
              <CommandGroup heading="Tasks">
                {results.tasks.map((t: any) => (
                  <CommandItem
                    key={t.id}
                    data-id={t.id}
                    data-type="task"
                    data-title={t.title}
                    onSelect={() => runCommand(() => router.push("/tasks"))}
                  >
                    <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{t.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Notes Group */}
            {results.notes.length > 0 && (
              <CommandGroup heading="Notes">
                {results.notes.map((n: any) => (
                  <CommandItem
                    key={n.id}
                    data-id={n.id}
                    data-type="note"
                    data-title={n.title}
                    onSelect={() => runCommand(() => router.push(`/notes`))}
                  >
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{n.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Goals Group */}
            {results.goals.length > 0 && (
              <CommandGroup heading="Goals">
                {results.goals.map((g: any) => (
                  <CommandItem
                    key={g.id}
                    data-id={g.id}
                    data-type="goal"
                    data-title={g.title}
                    onSelect={() => runCommand(() => router.push("/goals"))}
                  >
                    <Target className="mr-2 h-4 w-4" style={{ color: g.color || undefined }} />
                    <span>{g.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Habits Group */}
            {results.habits.length > 0 && (
              <CommandGroup heading="Habits">
                {results.habits.map((h: any) => (
                  <CommandItem
                    key={h.id}
                    data-id={h.id}
                    data-type="habit"
                    data-title={h.title}
                    onSelect={() => runCommand(() => router.push("/habits"))}
                  >
                    <Activity className="mr-2 h-4 w-4" style={{ color: habitColorMap(h) }} />
                    <span>{h.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          {/* Footer bar */}
          <div className="h-10 border-t px-3 flex items-center justify-between text-[10px] font-bold text-muted-foreground bg-muted/20 select-none shrink-0">
            <div className="flex gap-2.5">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <kbd className="px-1 border rounded bg-background">Esc</kbd> to close
            </div>
          </div>
        </div>

        {/* Right Pane: Preview Panel (40% width) */}
        <div className="w-[40%] bg-muted/5 p-4 overflow-y-auto h-[380px] select-none shrink-0">
          <PreviewPanel item={highlightedItem} />
        </div>
      </div>
    </CommandDialog>
  )
}

function habitColorMap(habit: any) {
  return habit.color || "#f59e0b"
}

function PreviewPanel({ item }: { item: any }) {
  if (!item) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
        <Sparkles className="size-8 text-primary/30 mb-2 animate-pulse" />
        <p className="text-xs font-semibold">Quick Preview</p>
        <p className="text-[10px] opacity-70 mt-0.5">Select an item to see its details and quick stats</p>
      </div>
    )
  }

  const { type, title, details } = item

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div>
        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {type}
        </span>
        <h4 className="font-bold text-sm text-foreground mt-2 leading-snug">{title}</h4>
      </div>

      <div className="border-t pt-3 space-y-2.5 text-xs">
        {/* Render type-specific details */}
        {type === "command" && details && (
          <div className="space-y-2 text-muted-foreground">
            <p className="leading-relaxed">{details.description}</p>
            {details.shortcut && (
              <div className="flex justify-between items-center bg-muted/40 p-2 rounded-xl border border-border/50 text-[10px] font-bold">
                <span>Shortcut</span>
                <kbd className="px-1.5 py-0.5 border rounded bg-background font-mono">{details.shortcut}</kbd>
              </div>
            )}
          </div>
        )}

        {type === "task" && details && (
          <div className="space-y-2">
            {details.description && (
              <p className="text-muted-foreground text-[11px] leading-relaxed italic">
                "{details.description}"
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <div className="bg-muted/30 p-2 rounded-xl border">
                <span className="text-muted-foreground block text-[9px] uppercase">Status</span>
                <span className="text-foreground">{details.status}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded-xl border">
                <span className="text-muted-foreground block text-[9px] uppercase">Priority</span>
                <span className="text-foreground">{details.priority}</span>
              </div>
            </div>
            {details.project && (
              <div className="flex items-center gap-1.5 p-2 bg-primary/5 border border-primary/10 rounded-xl">
                <Folder className="size-3.5 text-primary" style={{ color: details.project.color || undefined }} />
                <span className="font-semibold text-[10px] text-primary truncate">{details.project.name}</span>
              </div>
            )}
          </div>
        )}

        {type === "project" && details && (
          <div className="space-y-2">
            <div className="bg-muted/30 p-2 rounded-xl border text-[10px] font-bold">
              <span className="text-muted-foreground block text-[9px] uppercase">Status</span>
              <span className="text-foreground">{details.status || "ACTIVE"}</span>
            </div>
          </div>
        )}

        {type === "note" && details && (
          <div className="space-y-2 text-muted-foreground leading-relaxed">
            {details.content ? (
              <p className="text-[11px] line-clamp-6 bg-muted/20 p-2.5 rounded-xl border">
                {details.content.substring(0, 150)}...
              </p>
            ) : (
              <p className="text-[11px] italic">Empty note</p>
            )}
          </div>
        )}

        {type === "goal" && details && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <div className="bg-muted/30 p-2 rounded-xl border">
                <span className="text-muted-foreground block text-[9px] uppercase">Category</span>
                <span className="text-foreground">{details.category}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded-xl border">
                <span className="text-muted-foreground block text-[9px] uppercase">Priority</span>
                <span className="text-foreground">{details.priority}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-muted-foreground">Progress</span>
                <span style={{ color: details.color }}>{details.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${details.progress}%`, backgroundColor: details.color || "#3b82f6" }}
                />
              </div>
            </div>
          </div>
        )}

        {type === "habit" && details && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <div className="bg-muted/30 p-2 rounded-xl border">
                <span className="text-muted-foreground block text-[9px] uppercase">Frequency</span>
                <span className="text-foreground">{details.frequency}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded-xl border">
                <span className="text-muted-foreground block text-[9px] uppercase">Streak</span>
                <span className="text-foreground">{details.currentStreak} Days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
