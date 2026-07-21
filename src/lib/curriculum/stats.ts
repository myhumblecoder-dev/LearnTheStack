export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "QUIZ_PENDING" | "COMPLETED";

export interface TopicProgressInput {
  progress: { status: ProgressStatus } | null;
}

export interface CurriculumStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionPct: number;
}

export function computeCurriculumStats(topics: TopicProgressInput[]): CurriculumStats {
  const total = topics.length;

  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      completionPct: 0,
    };
  }

  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  for (const topic of topics) {
    const status = topic.progress?.status;

    if (status === "COMPLETED") {
      completed++;
    } else if (status === "IN_PROGRESS" || status === "QUIZ_PENDING") {
      inProgress++;
    } else if (status === "NOT_STARTED" || !status) {
      notStarted++;
    }
  }

  const completionPct = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    inProgress,
    notStarted,
    completionPct,
  };
}