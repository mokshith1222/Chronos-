"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, Calendar as CalendarIcon, FileText } from "lucide-react"

interface ProjectOverviewProps {
  project: any
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const completedTasks = 0 // Will implement tasks count later
  const totalTasks = project._count?.tasks || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const timeEntries = project._count?.timeEntries || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress}%</div>
          <Progress value={progress} className="h-2 mt-3" />
          <p className="text-xs text-muted-foreground mt-3">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Tracked</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0h 0m</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {timeEntries} time entries
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Created</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{new Date(project.createdAt).toLocaleDateString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            By Workspace Owner
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Updated</div>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
