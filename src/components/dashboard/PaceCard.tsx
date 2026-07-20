import type { PaceStatus } from "@/lib/curriculum/scheduleStatus"
import { Card, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

interface PaceCardProps {
  status: PaceStatus
}

export function PaceCard({ status }: PaceCardProps) {
  return (
    <Card>
      <CardTitle>Schedule Pace</CardTitle>
      <div className="mt-4 space-y-2">
        {status.onTrack ? (
          <>
            <Badge variant="success">On track</Badge>
            <p className="text-sm text-muted-foreground">You&apos;re on track</p>
          </>
        ) : (
          <>
            <Badge variant="warning">Behind</Badge>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {status.overdueCount} topics overdue
              </p>
              <p className="text-sm text-muted-foreground">
                {status.daysBehind} days behind
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}