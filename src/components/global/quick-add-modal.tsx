"use client"

import * as React from "react"
import { useOrganization } from "@/hooks/use-organization"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function QuickAddModal() {
  const [open, setOpen] = React.useState(false)
  const [taskName, setTaskName] = React.useState("")
  const addTask = useOrganization((state) => state.addTask)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+Shift+A (Note: shiftKey makes e.key uppercase 'A')
      if ((e.key === "A" || e.key === "a") && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) return
    
    // Natural Language Parsing simulation
    let projectId = null
    let titleStr = taskName.trim()
    
    // Smart Parsing
    const lower = titleStr.toLowerCase()
    if (lower.includes("tomorrow")) {
      titleStr = titleStr.replace(/tomorrow/i, "").trim()
      // In a real app, set dueDate to tomorrow here
    } else if (lower.includes("today")) {
      titleStr = titleStr.replace(/today/i, "").trim()
      // In a real app, set dueDate to today here
    }
    
    addTask(titleStr, projectId)
    setTaskName("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border border-border/50 shadow-2xl bg-card/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-5 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <DialogTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              Quick Add
            </DialogTitle>
            <div className="flex gap-1">
              <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>
              </kbd>
              <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⇧
              </kbd>
              <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                A
              </kbd>
            </div>
          </div>
          <Input 
            autoFocus
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Update brand guidelines #Acme @Tomorrow" 
            className="border-0 h-16 rounded-none focus-visible:ring-0 text-lg px-5 placeholder:text-muted-foreground/40 bg-transparent"
          />
          {/* Smart Parse Preview */}
          {(taskName.toLowerCase().includes('tomorrow') || taskName.toLowerCase().includes('today')) && (
            <div className="px-5 py-3 border-t border-border/50 bg-primary/5 flex items-center gap-2 text-xs font-medium text-primary">
              ✨ Smart Parse: Due Date will be set to {taskName.toLowerCase().includes('tomorrow') ? 'Tomorrow' : 'Today'}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
