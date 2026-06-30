"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { AppearanceSettings } from "@/features/settings/components/appearance-settings"
import { ProductivitySettings } from "@/features/settings/components/productivity-settings"
import { NotificationSettings } from "@/features/settings/components/notification-settings"
import { AccessibilitySettings } from "@/features/settings/components/accessibility-settings"
import { ShortcutSettings } from "@/features/settings/components/shortcut-settings"
import { DataSettings } from "@/features/settings/components/data-settings"
import { usePreferencesStore } from "@/stores/preferences-store"
import {
  User,
  Palette,
  Bell,
  Eye,
  Keyboard,
  Database,
  ChevronRight,
  Settings,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SettingsTab = "appearance" | "productivity" | "notifications" | "accessibility" | "shortcuts" | "data"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("appearance")
  const { fetchPreferences, isLoading } = usePreferencesStore()

  React.useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const tabLabels: Record<SettingsTab, string> = {
    appearance: "Appearance",
    productivity: "Productivity",
    notifications: "Notifications",
    accessibility: "Accessibility",
    shortcuts: "Keyboard Shortcuts",
    data: "Data & Backups",
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl flex flex-col gap-6 h-full">
        {/* Header & Breadcrumb */}
        <div className="flex flex-col gap-1.5 border-b pb-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            <span>Settings</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{tabLabels[activeTab]}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
            <Settings className="size-8 text-primary" />
            Preferences
          </h1>
          <p className="text-muted-foreground text-sm">
            Customize and configure your Chronos workspace environment.
          </p>
        </div>

        {/* Sidebar + Tab Layout */}
        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Mobile Navigation Dropdown */}
          <div className="block md:hidden w-full">
            <Select
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as SettingsTab)}
            >
              <SelectTrigger className="w-full h-11 rounded-xl bg-card border-border/50 font-semibold shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appearance">🎨 Appearance</SelectItem>
                <SelectItem value="productivity">👤 Productivity</SelectItem>
                <SelectItem value="notifications">🔔 Notifications</SelectItem>
                <SelectItem value="accessibility">👁️ Accessibility</SelectItem>
                <SelectItem value="shortcuts">⌨️ Keyboard Shortcuts</SelectItem>
                <SelectItem value="data">💾 Data & Backups</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Navigation Sidebar */}
          <aside className="hidden md:block w-60 shrink-0">
            <nav className="flex flex-col gap-1.5">
              <Button
                variant={activeTab === "appearance" ? "secondary" : "ghost"}
                className={`justify-start rounded-xl text-xs font-bold shrink-0 whitespace-nowrap ${
                  activeTab === "appearance" ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="mr-2 size-4" /> Appearance
              </Button>
              <Button
                variant={activeTab === "productivity" ? "secondary" : "ghost"}
                className={`justify-start rounded-xl text-xs font-bold shrink-0 whitespace-nowrap ${
                  activeTab === "productivity" ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("productivity")}
              >
                <User className="mr-2 size-4" /> Productivity
              </Button>
              <Button
                variant={activeTab === "notifications" ? "secondary" : "ghost"}
                className={`justify-start rounded-xl text-xs font-bold shrink-0 whitespace-nowrap ${
                  activeTab === "notifications" ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 size-4" /> Notifications
              </Button>
              <Button
                variant={activeTab === "accessibility" ? "secondary" : "ghost"}
                className={`justify-start rounded-xl text-xs font-bold shrink-0 whitespace-nowrap ${
                  activeTab === "accessibility" ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("accessibility")}
              >
                <Eye className="mr-2 size-4" /> Accessibility
              </Button>
              <Button
                variant={activeTab === "shortcuts" ? "secondary" : "ghost"}
                className={`justify-start rounded-xl text-xs font-bold shrink-0 whitespace-nowrap ${
                  activeTab === "shortcuts" ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("shortcuts")}
              >
                <Keyboard className="mr-2 size-4" /> Keyboard Shortcuts
              </Button>
              <Button
                variant={activeTab === "data" ? "secondary" : "ghost"}
                className={`justify-start rounded-xl text-xs font-bold shrink-0 whitespace-nowrap ${
                  activeTab === "data" ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("data")}
              >
                <Database className="mr-2 size-4" /> Data & Backups
              </Button>
            </nav>
          </aside>

          {/* Main settings form area */}
          <div className="flex-1 max-w-2xl">
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-40 bg-muted rounded-2xl" />
                <div className="h-48 bg-muted rounded-2xl" />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "appearance" && <AppearanceSettings />}
                {activeTab === "productivity" && <ProductivitySettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "accessibility" && <AccessibilitySettings />}
                {activeTab === "shortcuts" && <ShortcutSettings />}
                {activeTab === "data" && <DataSettings />}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
