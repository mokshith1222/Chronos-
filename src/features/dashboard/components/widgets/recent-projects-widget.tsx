"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Folder } from "lucide-react"
import { useDashboardProjects } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentProjectsWidget() {
  const { data: projects, isLoading, isError } = useDashboardProjects()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !projects) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load projects
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
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Folder className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 col-span-2">No active projects</p>
            ) : (
              projects.map((project: any) => (
                <div key={project.id} className="flex flex-col p-3 rounded-lg border hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium truncate text-foreground group-hover:text-blue-500 transition-colors">{project.name}</span>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color || 'hsl(var(--primary))' }} />
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
