import { Card, CardTitle } from "@/components/ui/Card"
import { PressureIndicator } from "@/components/dashboard/PressureIndicator"
import type { WeeklyFreshnessResult } from "@/lib/curriculum/weeklyFreshness"

interface WeeklyFreshnessCardProps {
  result: WeeklyFreshnessResult
}

export function WeeklyFreshnessCard({ result }: WeeklyFreshnessCardProps) {
  return (
    <Card>
      <CardTitle>Weekly Freshness</CardTitle>
      <div className="space-y-2">
        <PressureIndicator pressure={result.pressure} freshness={result.freshness} />
        <p className="text-sm text-muted-foreground">
          {result.completedCount} of {result.totalCount} topics completed this week
        </p>
      </div>
    </Card>
  )
}