import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // 1. Create Default User
  let user = await db.user.findFirst()
  if (!user) {
    user = await db.user.create({
      data: {
        email: "alex@example.com",
        name: "Alex Developer",
      },
    })
    console.log("Created default user:", user)
  } else {
    console.log("Default user already exists:", user)
  }

  // 2. Create Default Workspace
  const workspaceId = "cm0q9z8x0000008l4f1h7a3n2"
  let workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  })

  if (!workspace) {
    workspace = await db.workspace.create({
      data: {
        id: workspaceId,
        name: "My Workspace",
        ownerId: user.id,
      },
    })
    console.log("Created default workspace:", workspace)
  } else {
    console.log("Default workspace already exists:", workspace)
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
