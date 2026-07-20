import { startOfUtcDay } from "@/lib/curriculum/schedule";

export interface ScheduleTopic {
  scheduledDate: Date | null;
  progress: { status: string } | null;
}

export interface PaceStatus {
  overdueCount: number;
  daysBehind: number;
  onTrack: boolean;
}

/**
 * Computes the learner's pace status by checking for overdue topics.
 * 
 * A topic is OVERDUE when:
 * 1. scheduledDate is not null
 * 2. startOfUtcDay(scheduledDate) < startOfUtcDay(today)
 * 3. progress?.status is not "COMPLETED"
 */
export function computeScheduleStatus(topics: ScheduleTopic[], today: Date): PaceStatus {
  const todayStart = startOfUtcDay(today);
  let overdueCount = 0;
  let earliestOverdueDate: Date | null = null;

  for (const topic of topics) {
    if (topic.scheduledDate === null) continue;

    const topicStart = startOfUtcDay(topic.scheduledDate);
    const isPast = topicStart < todayStart;
    const isNotCompleted = topic.progress?.status !== "COMPLETED";

    if (isPast && isNotCompleted) {
      overdueCount++;
      if (earliestOverdueDate === null || topicStart < startOfUtcDay(earliestOverdueDate)) {
        earliestOverdueDate = topic.scheduledDate;
      }
    }
  }

  const onTrack = overdueCount === 0;
  let daysBehind = 0;

  if (!onTrack && earliestOverdueDate !== null) {
    const earliestStart = startOfUtcDay(earliestOverdueDate);
    daysBehind = Math.round(
      (todayStart.getTime() - earliestStart.getTime()) / 86400000
    );
  }

  return {
    overdueCount,
    daysBehind,
    onTrack,
  };
}