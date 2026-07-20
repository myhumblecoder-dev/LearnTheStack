import type { Freshness } from "@/lib/curriculum/pressure"
import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"

interface PressureIndicatorProps {
  pressure: number
  freshness: Freshness
}

export function PressureIndicator({ pressure, freshness }: PressureIndicatorProps) {
  const pct = Math.round(pressure * 100)

  let variant: "success" | "warning" | "muted" = "muted"
  let label = "Stale"
  let color = "bg-zinc-600"

  if (freshness === "fresh") {
    variant = "success"
    label = "Fresh"
    color = "bg-green-600"
  } else if (freshness === "fading") {
    variant = "warning"
    label = "Fading"
    color = "bg-yellow-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant={variant}>{label}</Badge>
        <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
      </div>
      <ProgressBar value={pct} max={100} className={color} />
    </div>
  )
}