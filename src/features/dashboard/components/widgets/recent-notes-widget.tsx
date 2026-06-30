"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { FileText } from "lucide-react"
import { useDashboardNotes } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentNotesWidget() {
  const { data: notes, isLoading, isError } = useDashboardNotes()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !notes) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load notes
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0 shrink-0">
          <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
          <FileText className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-2">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notes created</p>
            ) : (
              notes.map((note: any) => (
                <div key={note.id} className="flex flex-col p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">{note.title}</span>
                  <span className="text-xs text-muted-foreground truncate mt-1">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
