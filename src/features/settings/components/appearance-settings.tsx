"use client"

import * as React from "react"
import { usePreferencesStore } from "@/stores/preferences-store"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Sun, Moon, Laptop, Layout } from "lucide-react"

const ACCENT_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
]

export function AppearanceSettings() {
  const { preferences, updatePreference } = usePreferencesStore()
  const { setTheme } = useTheme()

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
    updatePreference("theme", theme)
  }

  return (
    <div className="space-y-6">
      {/* 1. Theme Selector */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            Theme Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${
                preferences.theme === "light"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Sun className="size-5 text-muted-foreground" />
              <span className="text-xs font-semibold">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${
                preferences.theme === "dark"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Moon className="size-5 text-muted-foreground" />
              <span className="text-xs font-semibold">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${
                preferences.theme === "system"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Laptop className="size-5 text-muted-foreground" />
              <span className="text-xs font-semibold">System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Accent Colors */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            Accent Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updatePreference("accentColor", color.value)}
                className={`group relative size-8 rounded-full border border-border flex items-center justify-center transition-all ${
                  preferences.accentColor === color.value
                    ? "ring-2 ring-primary ring-offset-2 scale-105"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {preferences.accentColor === color.value && (
                  <div className="size-2 rounded-full bg-white shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Typography & Density */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layout className="size-4 text-primary" />
            Layout & Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Font Size */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5">
            <div>
              <span className="text-xs font-bold text-foreground">Font Size</span>
              <p className="text-[10px] text-muted-foreground">Adjust text scaling across the interface</p>
            </div>
            <select
              value={preferences.fontSize}
              onChange={(e) => updatePreference("fontSize", e.target.value)}
              className="h-8 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
            >
              <option value="sm">Small</option>
              <option value="base">Default</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>

          {/* Border Radius */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-border/50">
            <div>
              <span className="text-xs font-bold text-foreground">Border Radius</span>
              <p className="text-[10px] text-muted-foreground">Change the roundness of cards and buttons</p>
            </div>
            <div className="flex gap-1 bg-muted p-0.5 rounded-lg border">
              {(["none", "md", "lg", "xl", "full"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => updatePreference("borderRadius", r)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                    preferences.borderRadius === r
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* UI Density */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-border/50">
            <div>
              <span className="text-xs font-bold text-foreground">UI Density</span>
              <p className="text-[10px] text-muted-foreground">Adjust padding and spacing of lists and panels</p>
            </div>
            <div className="flex gap-1 bg-muted p-0.5 rounded-lg border">
              <button
                onClick={() => updatePreference("uiDensity", "default")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  preferences.uiDensity === "default"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Default
              </button>
              <button
                onClick={() => updatePreference("uiDensity", "compact")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  preferences.uiDensity === "compact"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Compact
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
