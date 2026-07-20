import type { CurriculumStats } from "@/lib/curriculum/stats"
import { Card, CardTitle } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"

interface CompletionCardProps {
  stats: CurriculumStats
}

export function CompletionCard({ stats }: CompletionCardProps) {
  return (
    <Card>
      <CardTitle>Curriculum Progress</CardTitle>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{stats.completionPct}%</span>
        </div>
        <ProgressBar value={stats.completionPct} max={100} />
        <div className="text-sm text-muted-foreground">
          {stats.completed} of {stats.total} topics completed
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{stats.inProgress} in progress</span>
          <span>{stats.notStarted} not started</span>
        </div>
      </div>
    </Card>
  )
}