"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Folder, MoreVertical, Calendar, CheckCircle2, Clock } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { widgetHover } from "@/lib/animations"

interface ProjectCardProps {
  project: any
  onEdit: (project: any) => void
  onDelete: (project: any) => void
  onArchive: (project: any) => void
}

export function ProjectCard({ project, onEdit, onDelete, onArchive }: ProjectCardProps) {
  const completedTasks = 0 // In reality, calculate from project.tasks or _count
  const totalTasks = project._count?.tasks || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const statusColors = {
    ACTIVE: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    ON_HOLD: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <Card className="h-full flex flex-col group cursor-pointer border-border hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: project.color || "var(--primary)", color: "white" }}
            >
              <Folder className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <Link href={`/projects/${project.id}`} className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                {project.name}
              </Link>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity" })}>
              <MoreVertical className="h-4 w-4" />
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
        </CardHeader>
        
        <Link href={`/projects/${project.id}`} className="flex-1 flex flex-col">
          <CardContent className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className={`text-[10px] uppercase font-bold tracking-wider ${statusColors[project.status as keyof typeof statusColors]}`}>
                {project.status.replace("_", " ")}
              </Badge>
              {project.isArchived && (
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                  ARCHIVED
                </Badge>
              )}
            </div>

            <div className="space-y-1.5 mt-auto">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </CardContent>

          <CardFooter className="pt-0 border-t border-border/40 mt-4 flex items-center justify-between py-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{completedTasks}/{totalTasks} tasks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  )
}
