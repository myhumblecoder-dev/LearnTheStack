import { computeTopicPressure } from "@/lib/curriculum/pressure";

export interface PressureTopic {
  reviewStage: number;
  nextReviewAt: Date | null;
  status: string;
}

/**
 * Aggregates pressure for a group of topics by calculating the mean
 * pressure of all completed topics within that group.
 * 
 * @param topics - An array of topics with their progress metadata.
 * @param today - The reference date for calculating freshness.
 * @returns A value between 0 and 1 representing the mean pressure.
 */
export function aggregatePressure(topics: PressureTopic[], today: Date): number {
  const completedTopics = topics.filter((t) => t.status === "COMPLETED");

  if (completedTopics.length === 0) {
    return 0;
  }

  const totalPressure = completedTopics.reduce((sum, topic) => {
    return sum + computeTopicPressure(topic.reviewStage, topic.nextReviewAt, today);
  }, 0);

  return totalPressure / completedTopics.length;
}