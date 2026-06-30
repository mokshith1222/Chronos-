import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const DEFAULT_PREFERENCES = {
  theme: "system",
  accentColor: "#3b82f6",
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

async function getOrCreateUser() {
  let user = await db.user.findFirst()
  if (!user) {
    user = await db.user.create({
      data: {
        email: "alex@example.com",
        name: "Alex Developer",
      },
    })
  }
  return user
}

export async function GET(req: NextRequest) {
  try {
    const user = await getOrCreateUser()

    let preference = await db.userPreference.findUnique({
      where: { userId: user.id },
    })

    if (!preference) {
      preference = await db.userPreference.create({
        data: {
          userId: user.id,
          preferences: DEFAULT_PREFERENCES,
        },
      })
    }

    return NextResponse.json(preference.preferences)
  } catch (error) {
    console.error("[SETTINGS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getOrCreateUser()
    const body = await req.json()

    let preference = await db.userPreference.findUnique({
      where: { userId: user.id },
    })

    const currentPrefs = preference ? (preference.preferences as any) : DEFAULT_PREFERENCES
    const newPrefs = { ...currentPrefs, ...body }

    if (preference) {
      preference = await db.userPreference.update({
        where: { userId: user.id },
        data: { preferences: newPrefs },
      })
    } else {
      preference = await db.userPreference.create({
        data: {
          userId: user.id,
          preferences: newPrefs,
        },
      })
    }

    return NextResponse.json(preference.preferences)
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
