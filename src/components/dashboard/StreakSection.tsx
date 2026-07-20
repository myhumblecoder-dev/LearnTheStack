import { prisma } from "@/lib/db";
import { computeStudyStreak } from "@/lib/curriculum/streak";
import { todayUtc } from "@/lib/curriculum/schedule";
import { StreakCard } from "@/components/dashboard/StreakCard";

export async function StreakSection() {
  const sessions = await prisma.studySession.findMany({
    select: {
      startedAt: true,
    },
  });

  const streak = computeStudyStreak(
    sessions.map((s) => s.startedAt),
    todayUtc()
  );

  return <StreakCard streak={streak} />;
}