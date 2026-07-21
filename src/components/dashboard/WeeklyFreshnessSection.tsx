import { getWeekForDate, todayUtc } from "@/lib/curriculum/schedule";
import { computeWeeklyFreshness } from "@/lib/curriculum/weeklyFreshness";
import { WeeklyFreshnessCard } from "@/components/dashboard/WeeklyFreshnessCard";

export async function WeeklyFreshnessSection({ weekDate }: { weekDate: Date }) {
  const week = await getWeekForDate(weekDate);

  if (!week) {
    return null;
  }

  const topics = week.topics.map((t) => ({
    reviewStage: t.progress?.reviewStage ?? 0,
    nextReviewAt: t.progress?.nextReviewAt ?? null,
    status: t.progress?.status ?? "NOT_STARTED",
  }));

  const result = computeWeeklyFreshness(topics, todayUtc());

  return <WeeklyFreshnessCard result={result} />;
}