import { tool } from "ai";
import { z } from "zod";
import { getDueReviews } from "@/lib/curriculum/review";
import { getProgressStats, getRecentQuizAttempts } from "@/lib/curriculum/queries";

/**
 * Read-only tools the lesson tutor can call against the student's real data.
 * Each wraps an existing pure/query function; the Zod `inputSchema` is the tool
 * contract (define once, use as validation + LLM tool definition).
 *
 * All tools are server-executed, so the Vercel AI SDK runs the full
 * call → tool → call loop server-side and the client only streams text.
 */
export const tutorTools = {
  getDueReviews: tool({
    description:
      "List topics whose spaced-repetition review is due today or overdue, soonest first. " +
      "Call this when the student asks what to review, what's due, or how their retention is holding up.",
    inputSchema: z.object({}),
    execute: async () => {
      const due = await getDueReviews();
      return due.map((t) => ({
        topic: t.title,
        month: t.week.month.title,
        reviewStage: t.progress?.reviewStage ?? 0,
        dueDate: t.progress?.nextReviewAt?.toISOString().slice(0, 10) ?? null,
      }));
    },
  }),

  getProgressStats: tool({
    description:
      "Get overall curriculum progress: total topics, how many are completed, and how many are in progress. " +
      "Call this when the student asks how far along they are or what's left.",
    inputSchema: z.object({}),
    execute: async () => getProgressStats(),
  }),

  getRecentQuizAttempts: tool({
    description:
      "Get the student's most recent quiz attempts with scores. " +
      "Call this before assessing how well the student knows a topic, to ground feedback in real performance.",
    inputSchema: z.object({
      limit: z.number().int().min(1).max(20).default(5),
    }),
    execute: async ({ limit }) => {
      const attempts = await getRecentQuizAttempts(limit);
      return attempts.map((a) => ({
        topic: a.topic.title,
        score: a.score,
        passed: a.passed,
        at: a.createdAt.toISOString().slice(0, 10),
      }));
    },
  }),
};
