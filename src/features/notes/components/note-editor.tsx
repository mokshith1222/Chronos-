"use client"

import { useState, useEffect, useCallback } from "react"
import { useNote, useUpdateNote, useDeleteNote, useCreateNote } from "@/hooks/use-notes-queries"
import { useNotesStore } from "@/stores/notes-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Pin, Star, Archive, Trash2, Eye, Edit2, 
  Bold, Italic, Code, Heading1, ListTodo, RotateCcw, Save,
  Plus, FileText, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

export function NoteEditor() {
  const { selectedNoteId, setSelectedNoteId, activeFolderId } = useNotesStore()
  const { data: note, isLoading } = useNote(selectedNoteId)
  
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()
  const createNote = useCreateNote()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")

  // Debounced auto-save
  useEffect(() => {
    if (!note || selectedNoteId !== note.id) return

    // If local values match database, do nothing
    if (title === note.title && content === (note.content || "")) {
      return
    }

    setSaveStatus("saving")
    const timer = setTimeout(() => {
      updateNote.mutate({
        id: note.id,
        data: { title, content }
      }, {
        onSuccess: () => setSaveStatus("saved"),
        onError: () => setSaveStatus("unsaved")
      })
    }, 1000) // 1 second debounce

    return () => clearTimeout(timer)
  }, [title, content, note, selectedNoteId, updateNote])

  // Reset local state when note is first loaded or when selectedNoteId changes
  useEffect(() => {
    if (note && selectedNoteId === note.id) {
      setTitle(note.title)
      setContent(note.content || "")
      setSaveStatus("saved")
    }
  }, [selectedNoteId, note?.id])

  const handleCreateNote = () => {
    const folderId = (activeFolderId && !["favorites", "archive", "trash"].includes(activeFolderId)) 
      ? activeFolderId 
      : null
    createNote.mutate({ title: "Untitled Note", folderId }, {
      onSuccess: (data) => {
        setSelectedNoteId(data.id)
      }
    })
  }

  if (!selectedNoteId) {
    return (
      <div className="flex-1 bg-background flex flex-col items-center justify-center text-muted-foreground select-none p-6 hidden md:flex">
        <div className="max-w-sm text-center space-y-4">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <FileText className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No Note Selected</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select an existing note from the list, or create a new one to start writing.
            </p>
          </div>
          <Button onClick={handleCreateNote} size="sm" className="rounded-xl font-semibold gap-1.5" disabled={createNote.isPending}>
            <Plus className="size-3.5" />
            Create a Note
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !note) {
    return (
      <div className="flex-1 bg-background p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-[400px] bg-muted/10 rounded w-full" />
      </div>
    )
  }

  // Word & Character count
  const charCount = content.length
  const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  const insertText = (before: string, after: string) => {
    const textarea = document.getElementById("note-content-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    
    const selected = text.substring(start, end)
    const replacement = before + selected + after
    
    setContent(text.substring(0, start) + replacement + text.substring(end))
    
    // Refocus and set selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  // A custom, lightweight regex-based Markdown parser for previewing
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return ""
    let html = markdown
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-5 mb-2.5">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-6 mb-3">$1</h1>')

    // Bold & Italic
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>')

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-3 rounded-lg font-mono text-xs my-3 overflow-x-auto border">$1</pre>')
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded font-mono text-xs border">$1</code>')

    // Checklists
    html = html.replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 text-sm my-1"><input type="checkbox" disabled class="rounded" /> <span>$1</span></div>')
    html = html.replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 text-sm my-1"><input type="checkbox" disabled checked class="rounded" /> <span class="line-through text-muted-foreground">$1</span></div>')

    // Bullet Lists
    html = html.replace(/^- (.*$)/gim, '<li class="list-disc list-inside ml-2 text-sm">$1</li>')

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/40 pl-4 italic my-3 text-muted-foreground">$1</blockquote>')

    // Line breaks
    html = html.replace(/\n/g, "<br />")

    return html
  }

  const handlePermanentDelete = () => {
    deleteNote.mutate(note.id, {
      onSuccess: () => {
        setSelectedNoteId(null)
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Editor Header Toolbar */}
      <div className="p-3 border-b flex items-center justify-between bg-card/20 select-none flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          {/* Back Button for Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 mr-1"
            onClick={() => setSelectedNoteId(null)}
            aria-label="Go back to notes list"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "edit" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => setViewMode("edit")}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => setViewMode("preview")}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
        </div>

        {/* Formatting Helpers (only in Edit mode) */}
        {viewMode === "edit" && (
          <div className="hidden sm:flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertText("**", "**")}>
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertText("*", "*")}>
              <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertText("`", "`")}>
              <Code className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertText("# ", "")}>
              <Heading1 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertText("- [ ] ", "")}>
              <ListTodo className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Document Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {note.isTrash ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => updateNote.mutate({ id: note.id, data: { isTrash: false } })}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handlePermanentDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Forever
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 rounded-lg", note.isPinned ? "text-primary bg-primary/10" : "text-muted-foreground")}
                onClick={() => updateNote.mutate({ id: note.id, data: { isPinned: !note.isPinned } })}
              >
                <Pin className="h-4 w-4 rotate-45" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 rounded-lg", note.isFavorite ? "text-amber-500 bg-amber-500/10" : "text-muted-foreground")}
                onClick={() => updateNote.mutate({ id: note.id, data: { isFavorite: !note.isFavorite } })}
              >
                <Star className="h-4 w-4 fill-current" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 rounded-lg", note.isArchived ? "text-primary bg-primary/10" : "text-muted-foreground")}
                onClick={() => updateNote.mutate({ id: note.id, data: { isArchived: !note.isArchived } }, {
                  onSuccess: () => setSelectedNoteId(null)
                })}
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => updateNote.mutate({ id: note.id, data: { isTrash: true } }, {
                  onSuccess: () => setSelectedNoteId(null)
                })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Title Input */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-transparent hover:border-transparent focus:border-transparent focus:ring-0 bg-transparent px-0 py-2 h-auto mb-4 placeholder:opacity-40"
          placeholder="Note Title"
          disabled={note.isTrash}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-[300px]">
          {viewMode === "edit" ? (
            <Textarea
              id="note-content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing in markdown..."
              className="w-full h-full min-h-[350px] resize-none border-transparent hover:border-transparent focus:border-transparent focus:ring-0 bg-transparent p-0 text-sm leading-relaxed placeholder:opacity-30"
              disabled={note.isTrash}
            />
          ) : (
            <div 
              className="prose dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          )}
        </div>
      </div>

      {/* Editor Footer / Info Status */}
      <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground/80 font-semibold select-none">
        <div className="flex items-center gap-4">
          <span>{charCount} Characters</span>
          <span>{wordCount} Words</span>
          <span>{readingTime} Min Read</span>
        </div>

        <div className="flex items-center gap-1.5">
          {saveStatus === "saving" ? (
            <>
              <span className="animate-pulse">Saving...</span>
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Save className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-500">Saved</span>
            </>
          ) : (
            <span className="text-destructive">Unsaved changes</span>
          )}
        </div>
      </div>
    </div>
  )
}
