import { intervalForStage } from "@/lib/curriculum/review";
import { startOfUtcDay, addDays } from "@/lib/curriculum/schedule";

export type Freshness = "fresh" | "fading" | "stale";

/**
 * Computes the knowledge freshness (0..1) of a topic using an Ebbinghaus forgetting curve.
 * 
 * @param reviewStage - The current spaced-repetition stage of the topic.
 * @param nextReviewAt - The date the next review is scheduled. If null, the topic is considered fully fresh.
 * @param today - The reference date for computing decay.
 * @returns A value between 0 and 1 representing the current pressure/freshness.
 */
export function computeTopicPressure(
  reviewStage: number,
  nextReviewAt: Date | null,
  today: Date
): number {
  if (nextReviewAt === null) {
    return 1;
  }

  const interval = intervalForStage(reviewStage);
  const lastReviewed = addDays(startOfUtcDay(nextReviewAt), -interval);
  
  const todayStart = startOfUtcDay(today);
  const diffMs = todayStart.getTime() - lastReviewed.getTime();
  const daysSince = Math.max(0, Math.round(diffMs / 86400000));

  // Ebbinghaus formula: R = e^(-t/S)
  // where t is time passed and S is the interval.
  return Math.min(1, Math.exp(-daysSince / interval));
}

/**
 * Maps a numeric pressure value to a discrete freshness category.
 * 
 * @param pressure - The computed pressure value (0..1).
 * @returns The corresponding Freshness string literal.
 */
export function deriveFreshness(pressure: number): Freshness {
  if (pressure >= 0.5) {
    return "fresh";
  }
  if (pressure >= 0.1) {
    return "fading";
  }
  return "stale";
}
