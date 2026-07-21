import { getWeekForDate, todayUtc } from "@/lib/curriculum/schedule";
import type { PressureTopic } from "@/lib/curriculum/pressureRollup";
import { computeWeeklyFreshness } from "@/lib/curriculum/weeklyFreshness";
import { WeeklyFreshnessCard } from "@/components/dashboard/WeeklyFreshnessCard";

export default async function ThisWeekFreshnessSection() {
  const today = todayUtc();
  const week = await getWeekForDate(today);

  if (!week) {
    return null;
  }

  const topics: PressureTopic[] = week.topics.map((t) => ({
    reviewStage: t.progress?.reviewStage ?? 0,
    nextReviewAt: t.progress?.nextReviewAt ?? null,
    status: t.progress?.status ?? 'NOT_STARTED',
  }));

  const result = computeWeeklyFreshness(topics, today);

  return <WeeklyFreshnessCard result={result} />;
}