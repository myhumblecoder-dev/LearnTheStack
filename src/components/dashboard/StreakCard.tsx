import { Card, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

interface StreakCardProps {
  streak: number
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card>
      <CardTitle>Study Streak</CardTitle>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-2xl font-bold">{streak}</span>
        <span className="text-muted-foreground">day streak</span>
        {streak > 0 ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="muted">Inactive</Badge>
        )}
      </div>
    </Card>
  )
}