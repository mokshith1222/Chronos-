"use client"

import { useEffect } from "react"
import { useNotesStore } from "@/stores/notes-store"
import { useCreateNote } from "@/hooks/use-notes-queries"
import { NotesSidebar } from "@/features/notes/components/notes-sidebar"
import { NotesList } from "@/features/notes/components/notes-list"
import { NoteEditor } from "@/features/notes/components/note-editor"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function NotesPage() {
  const { activeFolderId, setSelectedNoteId } = useNotesStore()
  const createNote = useCreateNote()

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      // Alt+N to create a new note
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault()
        const folderId = (activeFolderId && !["favorites", "archive", "trash"].includes(activeFolderId)) 
          ? activeFolderId 
          : null

        createNote.mutate({ title: "Untitled Note", folderId }, {
          onSuccess: (data) => {
            setSelectedNoteId(data.id)
          }
        })
      }

      // Escape to close active note editor
      if (e.key === "Escape") {
        setSelectedNoteId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeFolderId, createNote, setSelectedNoteId])

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-background -m-6 md:-m-8 lg:-m-10">
        {/* 3-column Layout */}
        <NotesSidebar />
        <NotesList />
        <NoteEditor />
      </div>
    </DashboardLayout>
  )
}
