"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Folder, MoreHorizontal, Calendar, CheckCircle2, Clock } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ProjectListItemProps {
  project: any
  onEdit: (project: any) => void
  onDelete: (project: any) => void
  onArchive: (project: any) => void
}

export function ProjectListItem({ project, onEdit, onDelete, onArchive }: ProjectListItemProps) {
  const completedTasks = 0 
  const totalTasks = project._count?.tasks || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const statusColors = {
    ACTIVE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ON_HOLD: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group">
      <Link href={`/projects/${project.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
          style={{ backgroundColor: project.color || "var(--primary)", color: "white" }}
        >
          <Folder className="h-5 w-5" />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0 pr-4">
          <span className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
            {project.name}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(project.updatedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 w-32 shrink-0">
          <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${statusColors[project.status as keyof typeof statusColors]}`}>
            {project.status.replace("_", " ")}
          </Badge>
          {project.isArchived && (
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
              ARCHIVED
            </Badge>
          )}
        </div>

        <div className="hidden sm:flex flex-col gap-1.5 w-32 shrink-0 px-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </Link>

      <div className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" })}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(project)}>Edit Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(project)}>
              {project.isArchived ? "Restore" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => onDelete(project)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
