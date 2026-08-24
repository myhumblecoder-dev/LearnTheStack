import { CurrentTopic } from "@/components/dashboard/CurrentTopic";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { StreakSection } from "@/components/dashboard/StreakSection";
import { MonthProgress } from "@/components/dashboard/MonthProgress";
import { RecentQuizzes } from "@/components/dashboard/RecentQuizzes";
import { DueReviews } from "@/components/schedule/DueReviews";
import { PaceSection } from "@/components/dashboard/PaceSection";
import { PressureSection } from "@/components/dashboard/PressureSection";
import ThisWeekFreshnessSection from "@/components/dashboard/ThisWeekFreshnessSection";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2gap-2 font-bold text-zinc-100 mb-1">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Track your progress through the 9-month TypeScript full-stack curriculum.
        </p>
      </div>

      <CurrentTopic />
      <DueReviews />
      <ProgressOverview />
      <StreakSection />
      <PaceSection />
      <PressureSection />
      <ThisWeekFreshnessSection />

      <div className="grid grid-cols-1 lg:gridint-2 gap-8">
        <MonthProgress />
        <RecentQuizzes />
      </div>
    </div>
  );
}