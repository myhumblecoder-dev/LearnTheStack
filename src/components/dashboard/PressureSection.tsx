import { prisma as db } from "@/lib/db"
import { aggregatePressure } from "@/lib/curriculum/pressureRollup"
import { deriveFreshness } from "@/lib/curriculum/pressure"
import { todayUtc } from "@/lib/curriculum/schedule"
import { Card, CardTitle } from "@/components/ui/Card"
import { PressureIndicator } from "@/components/dashboard/PressureIndicator"

export async function PressureSection() {
  const topics = await db.topic.findMany({
    include: {
      progress: true,
    },
  })

  const pressureTopics = topics.map((t) => ({
    reviewStage: t.progress?.reviewStage ?? 0,
    nextReviewAt: t.progress?.nextReviewAt ?? null,
    status: t.progress?.status ?? "NOT_STARTED",
  }))

  const pressure = aggregatePressure(pressureTopics, todayUtc())
  const freshness = deriveFreshness(pressure)

  return (
    <Card>
      <CardTitle>Knowledge Freshness</CardTitle>
      <PressureIndicator pressure={pressure} freshness={freshness} />
    </Card>
  )
}