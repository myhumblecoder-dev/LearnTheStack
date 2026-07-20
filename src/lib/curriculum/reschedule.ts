import { computeScheduleStatus } from "@/lib/curriculum/scheduleStatus";
import { addDays } from "@/lib/curriculum/schedule";

export interface RescheduleTopic {
  id: number;
  scheduledDate: Date | null;
  progress: { status: string } | null;
}

/**
 * Computes a new schedule by shifting all incomplete, scheduled topics forward
 * by the number of days the learner is currently behind.
 */
export function computeReschedule(
  topics: ResmutableTopic[],
  today: Date
): { topicId: number; newScheduledDate: Date }[] {
  const status = computeScheduleStatus(topics, today);

  // If the learner is on track, no rescheduling is needed.
  if (status.onTrack) {
    return [];
  }

  const shifts: { topicId: number; newScheduledDate: Date }[] = [];

  for (const topic of topics) {
    const isCompleted = topic.progress?.status === "COMPLETED";
    const hasScheduledDate = topic.scheduledDate !== null;

    // Only reschedule topics that are not completed and have a scheduled date.
    if (!isCompleted && hasScheduledDate) {
      // We know topic.scheduledDate is not null here due to the guard.
      const newDate = addDays(topic.scheduledDate!, status.daysBehind);
      shifts.push({
        topicId: topic.id,
        newScheduledDate: newDate,
      });
    }
  }

  return shifts;
}

// Type alias to satisfy the requirement of using the existing detector
// which expects the full ScheduleTopic structure.
type ResmutableTopic = RescheduleTopic;