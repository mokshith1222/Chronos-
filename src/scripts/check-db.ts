import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("Checking database status...")
  
  const users = await db.user.findMany()
  console.log(`Users count: ${users.length}`)
  console.log("Users:", users)

  const workspaces = await db.workspace.findMany()
  console.log(`Workspaces count: ${workspaces.length}`)
  console.log("Workspaces:", workspaces)

  const projects = await db.project.findMany()
  console.log(`Projects count: ${projects.length}`)

  const tasks = await db.task.findMany()
  console.log(`Tasks count: ${tasks.length}`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
