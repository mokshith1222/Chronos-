"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Keyboard } from "lucide-react"

const SHORTCUTS = [
  { action: "Toggle Command Palette", keys: ["⌘", "K"] },
  { action: "Start/Pause Focus Timer", keys: ["⌥", "T"] },
  { action: "Quick Add Task Dialog", keys: ["⌘", "Shift", "A"] },
  { action: "Toggle Zen Mode", keys: ["Z"] },
]

export function ShortcutSettings() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Keyboard className="size-4 text-primary" />
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-border/40 last:border-b-0"
            >
              <span className="text-xs font-semibold text-muted-foreground">{shortcut.action}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="h-6 min-w-6 px-1.5 inline-flex items-center justify-center rounded border bg-muted font-mono text-[11px] font-bold text-foreground shadow-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
