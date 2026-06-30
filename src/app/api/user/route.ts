import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

async function getOrCreateUser(userId?: string | null) {
  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
    })
    if (user) return user
  }

  let user = await db.user.findFirst()
  if (!user) {
    user = await db.user.create({
      data: {
        email: "jane@example.com",
        name: "Jane Doe",
      },
    })
  }
  return user
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const user = await getOrCreateUser(userId)
    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const user = await getOrCreateUser(userId)
    
    const body = await req.json()
    const { name, email } = body

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[USER_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
