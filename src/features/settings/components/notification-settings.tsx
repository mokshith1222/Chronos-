"use client"

import * as React from "react"
import { usePreferencesStore } from "@/stores/preferences-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Volume2 } from "lucide-react"

export function NotificationSettings() {
  const { preferences, updatePreference } = usePreferencesStore()

  const handleNotificationToggle = async (checked: boolean) => {
    updatePreference("notificationsEnabled", checked)
    
    if (checked && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission()
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Desktop Alerts */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-muted-foreground" />
              <div>
                <span className="text-xs font-bold text-foreground">Desktop Notifications</span>
                <p className="text-[10px] text-muted-foreground">Receive browser alerts for timer ends and reminders</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notificationsEnabled}
                onChange={(e) => handleNotificationToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Audio Sounds */}
          <div className="flex items-center justify-between py-1.5 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Volume2 className="size-4 text-muted-foreground" />
              <div>
                <span className="text-xs font-bold text-foreground">Sound Effects</span>
                <p className="text-[10px] text-muted-foreground">Play a sound when timers finish or tasks are completed</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notificationSound}
                onChange={(e) => updatePreference("notificationSound", e.target.checked)}
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
