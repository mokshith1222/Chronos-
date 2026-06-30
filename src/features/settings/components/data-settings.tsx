"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Download, Upload, AlertTriangle, Cloud } from "lucide-react"

export function DataSettings() {
  const [isExporting, setIsExporting] = React.useState(false)
  const [isImporting, setIsImporting] = React.useState(false)
  const [isResetting, setIsResetting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // 1. Export Backup
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await fetch("/api/settings/backup")
      if (!res.ok) throw new Error("Failed to generate backup")
      
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement("a")
      a.href = url
      a.download = `chronos-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Backup Downloaded", {
        description: "Your workspace backup has been exported successfully.",
      })
    } catch (err) {
      console.error(err)
      toast.error("Export Failed", {
        description: "An error occurred while generating the backup.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // 2. Import / Restore Backup
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (!parsed.data) {
          throw new Error("Invalid backup format")
        }

        const res = await fetch("/api/settings/backup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        })

        if (!res.ok) throw new Error("Failed to restore backup")

        toast.success("Restore Successful", {
          description: "Your workspace has been successfully restored. Reloading...",
        })
        
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (err) {
        console.error(err)
        toast.error("Import Failed", {
          description: "The uploaded file is not a valid Chronos backup or could not be restored.",
        })
      } finally {
        setIsImporting(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsText(file)
  }

  // 3. Factory Reset
  const handleFactoryReset = async () => {
    if (!window.confirm("Are you absolutely sure you want to factory reset? This will permanently delete all your tasks, projects, notes, goals, and habits. This action CANNOT be undone.")) {
      return
    }

    setIsResetting(true)
    try {
      const res = await fetch("/api/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { projects: [], tasks: [], timeEntries: [], goals: [], habits: [], notes: [], calendarEvents: [] } }),
      })

      if (!res.ok) throw new Error("Reset failed")

      toast.success("Factory Reset Complete", {
        description: "All workspace data has been cleared. Reloading...",
      })

      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error(err)
      toast.error("Reset Failed", {
        description: "An error occurred while resetting the workspace.",
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Backup & Restore */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Cloud className="size-4 text-primary" />
            Data Backup & Restore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <span className="text-xs font-bold text-foreground">Export Workspace</span>
              <p className="text-[10px] text-muted-foreground">Download a copy of all your tasks, projects, notes, and metrics</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} className="rounded-xl">
              <Download className="size-3.5 mr-1.5" />
              {isExporting ? "Exporting..." : "Export JSON"}
            </Button>
          </div>

          {/* Import */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-t border-border/50">
            <div>
              <span className="text-xs font-bold text-foreground">Restore Workspace</span>
              <p className="text-[10px] text-muted-foreground">Restore your workspace data from a previously exported JSON file</p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="rounded-xl"
              >
                <Upload className="size-3.5 mr-1.5" />
                {isImporting ? "Restoring..." : "Upload & Restore"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-2xl border border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
            <div>
              <span className="text-xs font-bold text-foreground">Factory Reset Workspace</span>
              <p className="text-[10px] text-muted-foreground">Delete all tasks, projects, habits, goals, and time entries. This is irreversible.</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleFactoryReset}
              disabled={isResetting}
              className="rounded-xl"
            >
              {isResetting ? "Resetting..." : "Reset All Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
