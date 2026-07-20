import { prisma as db } from "@/lib/db"
import { computeScheduleStatus } from "@/lib/curriculum/scheduleStatus"
import { todayUtc } from "@/lib/curriculum/schedule"
import { PaceCard } from "@/components/dashboard/PaceCard"

export async function PaceSection() {
  const topics = await db.topic.findMany({
    include: {
      progress: true,
    },
  })

  const status = computeScheduleStatus(topics, todayUtc())

  return <PaceCard status={status} />
}