import { prisma } from "@/lib/db"
import { computeWeeklyFreshness } from "@/lib/curriculum/weeklyFreshness"
import type { WeeklyFreshnessResult } from "@/lib/curriculum/weeklyFreshness"
import type { PressureTopic } from "@/lib/curriculum/pressureRollup"

export interface WeekFreshnessRow {
  weekId: number
  weekNum: number
  title: string
  startDate: Date
  endDate: Date
  freshness: WeeklyFreshnessResult
}

export async function getAllWeeksWithFreshness(today: Date) {
  const weeks = await prisma.week.findMany({
    orderBy: { startDate: 'asc' },
    include: {
      topics: {
        include: {
          progress: true
        }
      }
    }
  })

  return weeks.map((week) => {
    const topics: PressureTopic[] = week.topics.map((t) => ({
      reviewStage: t.progress?.reviewStage ?? 0,
      nextReviewAt: t.progress?.nextReviewAt ?? null,
      status: t.progress?.status ?? 'NOT_STARTED'
    }))

    const freshness = computeWeeklyFreshness(topics, today)

    return {
      weekId: week.id,
      weekNum: week.weekNum,
      title: week.title,
      startDate: week.startDate,
      endDate: week.endDate,
      freshness
    }
  })
}