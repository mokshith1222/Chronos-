"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle2, MoreVertical, Edit2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectHeaderProps {
  project: any
  onEdit: () => void
  onDelete: () => void
  onArchive: () => void
}

export function ProjectHeader({ project, onEdit, onDelete, onArchive }: ProjectHeaderProps) {
  const statusColors = {
    ACTIVE: "bg-blue-500/10 text-blue-500",
    COMPLETED: "bg-emerald-500/10 text-emerald-500",
    ON_HOLD: "bg-amber-500/10 text-amber-500",
    CANCELLED: "bg-red-500/10 text-red-500",
  }

  return (
    <div className="flex flex-col gap-6 py-6 border-b">
      <div className="flex items-center gap-4">
        <Link 
          href="/projects" 
          className={`${buttonVariants({ variant: "ghost", size: "icon" })} shrink-0 -ml-2`}
          aria-label="Go back to projects"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-xl"
            style={{ backgroundColor: project.color || "var(--primary)" }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{project.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <Badge variant="secondary" className={`text-[10px] uppercase font-bold tracking-wider border-0 ${statusColors[project.status as keyof typeof statusColors]}`}>
                {project.status.replace("_", " ")}
              </Badge>
              {project.isArchived && (
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                  ARCHIVED
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit} className="hidden sm:flex">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Project
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "icon" })}>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="sm:hidden" onClick={onEdit}>Edit Details</DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                {project.isArchived ? "Restore Project" : "Archive Project"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                onClick={onDelete}
              >
                Delete Permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
