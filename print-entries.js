const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

async function main() {
  const task = await db.task.findFirst({
    where: { title: "EEE" },
    include: {
      timeEntries: true
    }
  })

  if (!task) {
    console.log("Task EEE not found")
    return
  }

  console.log(`Task: ${task.title} (actualTime: ${task.actualTime}m)`)
  console.log("Time Entries:")
  task.timeEntries.forEach((entry, idx) => {
    console.log(`  [${idx + 1}] ID: ${entry.id}`)
    console.log(`      Start: ${entry.startTime}`)
    console.log(`      End: ${entry.endTime}`)
    console.log(`      Duration: ${entry.duration} seconds (${Math.round(entry.duration / 60)}m)`)
    console.log(`      Type: ${entry.type}`)
  })
}

main().finally(() => db.$disconnect())
