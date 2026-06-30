"use client"

import { useTimeEntries, useDeleteTimeEntry } from "@/hooks/use-time-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Trash2, Tag, Bookmark } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function TimeHistoryList() {
  const { data: entries, isLoading, isError } = useTimeEntries(30)
  const deleteEntry = useDeleteTimeEntry()

  if (isLoading) {
    return (
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError || !entries) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-10 text-center text-sm text-destructive">
          Failed to load history
        </CardContent>
      </Card>
    )
  }

  const formatDuration = (totalSeconds: number | null) => {
    if (!totalSeconds) return "0s"
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return [
      hrs > 0 ? `${hrs}h` : null,
      mins > 0 ? `${mins}m` : null,
      secs > 0 || (hrs === 0 && mins === 0) ? `${secs}s` : null,
    ].filter(Boolean).join(" ")
  }

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Tracking History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No logged sessions yet. Start tracking to build your history!
            </div>
          ) : (
            entries.map((entry: any) => (
              <div 
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-background/30 hover:bg-background/60 transition-colors group"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {entry.description || "Untitled Session"}
                    </span>
                    <Badge variant="outline" className="text-[10px] scale-95 origin-left">
                      {entry.type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>-</span>
                      <span>{entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active"}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(entry.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>

                    {entry.project && (
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5" style={{ color: entry.project.color }} />
                        <span className="font-medium" style={{ color: entry.project.color }}>{entry.project.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="font-mono font-bold text-base text-foreground">
                    {formatDuration(entry.duration)}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={deleteEntry.isPending}
                    onClick={() => deleteEntry.mutate(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
