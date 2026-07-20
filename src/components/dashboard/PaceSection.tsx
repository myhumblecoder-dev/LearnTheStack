import { prisma as db } from "@/lib/db"
import { computeScheduleStatus } from "@/lib/curriculum/scheduleStatus"
import { todayUtc } from "@/lib/curriculum/schedule"
import { PaceCard } from "@/components/dashboard/PaceCard"
import { CatchUpButton } from "@/components/dashboard/CatchUpButton"

export async function PaceSection() {
  const topics = await db.topic.findMany({
    include: {
      progress: true,
    },
  })

  const status = computeScheduleStatus(topics, todayUtc())

  return (
    <div className="space-y-3">
      <PaceCard status={status} />
      {!status.onTrack && <CatchUpButton />}
    </div>
  )
}