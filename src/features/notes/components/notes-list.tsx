"use client"

import { useNotes, useCreateNote } from "@/hooks/use-notes-queries"
import { useNotesStore } from "@/stores/notes-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Pin, FileText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function NotesList() {
  const { activeFolderId, setActiveFolderId, searchQuery, setSearchQuery, selectedNoteId, setSelectedNoteId } = useNotesStore()
  
  // Map active folder filter to query parameters
  const queryFilters: any = {
    search: searchQuery || undefined,
  }

  if (activeFolderId === "favorites") {
    queryFilters.isFavorite = true
  } else if (activeFolderId === "archive") {
    queryFilters.isArchived = true
  } else if (activeFolderId === "trash") {
    queryFilters.isTrash = true
  } else if (activeFolderId && activeFolderId !== "none") {
    queryFilters.folderId = activeFolderId
  } else if (activeFolderId === "none") {
    queryFilters.folderId = "none"
  }

  const { data: notes, isLoading } = useNotes(queryFilters)
  const createNote = useCreateNote()

  const handleCreateNote = () => {
    // If we're inside a specific folder, pre-populate the folderId
    const folderId = (activeFolderId && !["favorites", "archive", "trash"].includes(activeFolderId)) 
      ? activeFolderId 
      : null

    const isFavorite = activeFolderId === "favorites"
    const isArchived = activeFolderId === "archive"
    const isTrash = activeFolderId === "trash"

    createNote.mutate({ 
      title: "Untitled Note", 
      folderId,
      isFavorite,
      isArchived,
      isTrash
    }, {
      onSuccess: (data) => {
        setSelectedNoteId(data.id)
      }
    })
  }

  return (
    <div className={cn("w-full md:w-80 border-r bg-card/40 flex flex-col h-full shrink-0 select-none", selectedNoteId ? "hidden md:flex" : "flex")}>
      {/* Search Box */}
      <div className="p-3 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 h-9 text-xs"
          />
        </div>
        <Button onClick={handleCreateNote} size="sm" className="w-full h-8 text-xs gap-1.5" disabled={createNote.isPending}>
          <Plus className="h-3.5 w-3.5" />
          New Note
        </Button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 border rounded-lg bg-muted/10 animate-pulse" />
            ))}
          </div>
        ) : !notes || notes.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
            <FileText className="w-8 h-8 mb-2 opacity-20" />
            <span className="text-xs">No notes found</span>
          </div>
        ) : (
          notes.map((note: any) => {
            const isActive = selectedNoteId === note.id
            const snippet = note.content 
              ? note.content.replace(/[#*`_[\]]/g, "").slice(0, 70) 
              : "No additional text"

            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left relative group",
                  isActive 
                    ? "bg-primary/10 border-primary/40 shadow-sm" 
                    : "border-border/40 hover:bg-accent/40 hover:border-border/80"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className={cn("font-semibold text-xs truncate text-foreground flex-1", isActive && "text-primary")}>
                    {note.title || "Untitled Note"}
                  </h4>
                  {note.isPinned && (
                    <Pin className="h-3 w-3 text-primary shrink-0 rotate-45" />
                  )}
                </div>
                
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 font-medium leading-relaxed">
                  {snippet}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 mt-2 font-semibold">
                  <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  {note.folder && (
                    <span className="bg-muted px-1.5 py-0.5 rounded-md truncate max-w-[80px]">
                      {note.folder.name}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
