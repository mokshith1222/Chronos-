"use client"

import { useState } from "react"
import { useFolders, useCreateFolder, useDeleteFolder } from "@/hooks/use-notes-queries"
import { useNotesStore } from "@/stores/notes-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, FolderPlus, Trash2, FileText, Star, Archive, Trash, ChevronRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function NotesSidebar() {
  const { activeFolderId, setActiveFolderId, sidebarOpen, toggleSidebar } = useNotesStore()
  const { data: folders, isLoading } = useFolders()
  const createFolder = useCreateFolder()
  const deleteFolder = useDeleteFolder()
  
  const [newFolderName, setNewFolderName] = useState("")

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    createFolder.mutate({ name: newFolderName.trim() }, {
      onSuccess: () => setNewFolderName("")
    })
  }

  const systemFilters = [
    { id: null, label: "All Notes", icon: FileText },
    { id: "favorites", label: "Favorites", icon: Star },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "trash", label: "Trash", icon: Trash },
  ]

  if (!sidebarOpen) {
    return (
      <div className="w-12 border-r bg-card flex flex-col items-center py-4 gap-4 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("w-64 border-r bg-card flex flex-col h-full shrink-0 select-none hidden lg:flex", !sidebarOpen && "lg:hidden")}>
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-bold text-sm tracking-wide text-foreground">Knowledge Base</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* System Filters */}
        <div className="space-y-1">
          {systemFilters.map((filter) => {
            const Icon = filter.icon
            const isActive = activeFolderId === filter.id

            return (
              <button
                key={filter.id ?? "all"}
                onClick={() => setActiveFolderId(filter.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </button>
            )
          })}
        </div>

        {/* Folders List */}
        <div className="space-y-2">
          <span className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Folders
          </span>
          
          <div className="space-y-0.5">
            {isLoading ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>
            ) : (
              folders?.map((folder: any) => {
                const isActive = activeFolderId === folder.id
                
                return (
                  <div
                    key={folder.id}
                    className={cn(
                      "group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                      isActive 
                        ? "bg-primary/15 text-primary" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                    onClick={() => setActiveFolderId(folder.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder className="h-4 w-4 shrink-0" />
                      <span className="truncate">{folder.name}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFolder.mutate(folder.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* New Folder Box */}
      <form onSubmit={handleCreateFolder} className="p-3 border-t bg-muted/20 flex gap-2">
        <Input
          placeholder="New folder..."
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="h-8 text-xs bg-background"
        />
        <Button type="submit" size="icon" className="h-8 w-8 shrink-0">
          <FolderPlus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
