import { aggregatePressure } from "@/lib/curriculum/pressureRollup";
import { deriveFreshness } from "@/lib/curriculum/pressure";
import type { PressureTopic } from "@/lib/curriculum/pressureRollup";
import type { Freshness } from "@/lib/curriculum/pressure";

export interface WeeklyFreshnessResult {
  pressure: number;
  freshness: Freshness;
  completedCount: number;
  totalCount: number;
}

export function computeWeeklyFreshness(topics: PressureTopic[], today: Date): WeeklyFreshnessResult {
  const totalCount = topics.length;
  const completedCount = topics.filter((t) => t.status === "COMPLETED").length;
  const pressure = aggregatePressure(topics, today);
  const freshness = deriveFreshness(pressure);

  return { pressure, freshness, completedCount, totalCount };
}