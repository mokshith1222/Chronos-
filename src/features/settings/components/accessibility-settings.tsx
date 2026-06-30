"use client"

import * as React from "react"
import { usePreferencesStore } from "@/stores/preferences-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, HelpCircle } from "lucide-react"

export function AccessibilitySettings() {
  const { preferences, updatePreference } = usePreferencesStore()

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            Accessibility Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-4 text-muted-foreground" />
              <div>
                <span className="text-xs font-bold text-foreground">Reduced Motion</span>
                <p className="text-[10px] text-muted-foreground">Minimize animations and transitions across the application</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.reducedMotion}
                onChange={(e) => updatePreference("reducedMotion", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-1.5 border-t border-border/50">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-4 text-muted-foreground" />
              <div>
                <span className="text-xs font-bold text-foreground">High Contrast</span>
                <p className="text-[10px] text-muted-foreground">Increase contrast of text, borders, and active indicators</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.highContrast}
                onChange={(e) => updatePreference("highContrast", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
