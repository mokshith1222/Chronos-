import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Preferences {
  theme: "light" | "dark" | "system"
  accentColor: string
  fontSize: "sm" | "base" | "lg" | "xl"
  uiDensity: "default" | "compact"
  borderRadius: "none" | "md" | "lg" | "xl" | "full"
  pomodoroWorkDuration: number
  pomodoroShortBreakDuration: number
  pomodoroLongBreakDuration: number
  defaultCalendarView: "month" | "week" | "day" | "agenda"
  defaultTaskPriority: "NO_PRIORITY" | "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  notificationsEnabled: boolean
  notificationSound: boolean
  reducedMotion: boolean
  highContrast: boolean
}

const DEFAULT_PREFERENCES: Preferences = {
  theme: "system",
  accentColor: "#3b82f6", // Default Blue
  fontSize: "base",
  uiDensity: "default",
  borderRadius: "xl",
  pomodoroWorkDuration: 25 * 60,
  pomodoroShortBreakDuration: 5 * 60,
  pomodoroLongBreakDuration: 15 * 60,
  defaultCalendarView: "week",
  defaultTaskPriority: "MEDIUM",
  notificationsEnabled: true,
  notificationSound: true,
  reducedMotion: false,
  highContrast: false,
}

interface PreferencesState {
  preferences: Preferences
  isLoading: boolean
  fetchPreferences: () => Promise<void>
  updatePreference: (key: keyof Preferences, value: any) => Promise<void>
  applyPreferences: (prefs: Preferences) => void
  resetPreferences: () => Promise<void>
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,
      isLoading: false,

      fetchPreferences: async () => {
        set({ isLoading: true })
        try {
          const res = await fetch("/api/settings")
          if (res.ok) {
            const data = await res.json()
            set({ preferences: data })
            get().applyPreferences(data)
          }
        } catch (err) {
          console.error("Failed to fetch preferences", err)
        } finally {
          set({ isLoading: false })
        }
      },

      updatePreference: async (key, value) => {
        const updatedPrefs = { ...get().preferences, [key]: value }
        set({ preferences: updatedPrefs })
        get().applyPreferences(updatedPrefs)

        try {
          await fetch("/api/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [key]: value }),
          })
        } catch (err) {
          console.error("Failed to sync preference with server", err)
        }
      },

      applyPreferences: (prefs) => {
        if (typeof window === "undefined") return

        const root = document.documentElement

        // 1. Apply Accent Color
        root.style.setProperty("--primary", prefs.accentColor)

        // 2. Apply Border Radius
        const radiusMap = {
          none: "0px",
          md: "0.5rem",
          lg: "0.75rem",
          xl: "1rem",
          full: "9999px",
        }
        root.style.setProperty("--radius", radiusMap[prefs.borderRadius] || "1rem")

        // 3. Apply Font Size
        const fontSizeMap = {
          sm: "14px",
          base: "16px",
          lg: "18px",
          xl: "20px",
        }
        root.style.fontSize = fontSizeMap[prefs.fontSize] || "16px"

        // 4. Apply UI Density
        if (prefs.uiDensity === "compact") {
          root.classList.add("density-compact")
        } else {
          root.classList.remove("density-compact")
        }

        // 5. Apply Accessibility: Reduced Motion
        if (prefs.reducedMotion) {
          root.classList.add("reduced-motion")
        } else {
          root.classList.remove("reduced-motion")
        }

        // 6. Apply Accessibility: High Contrast
        if (prefs.highContrast) {
          root.classList.add("high-contrast")
        } else {
          root.classList.remove("high-contrast")
        }
      },

      resetPreferences: async () => {
        set({ preferences: DEFAULT_PREFERENCES })
        get().applyPreferences(DEFAULT_PREFERENCES)

        try {
          await fetch("/api/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(DEFAULT_PREFERENCES),
          })
        } catch (err) {
          console.error("Failed to reset preferences on server", err)
        }
      },
    }),
    {
      name: "chronos-preferences",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.applyPreferences(state.preferences)
        }
      },
    }
  )
)
