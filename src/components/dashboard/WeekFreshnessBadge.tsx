import { Badge } from "@/components/ui/Badge";
import type { Freshness } from "@/lib/curriculum/pressure";

interface WeekFreshnessBadgeProps {
  freshness: Freshness;
  pressure: number;
}

export function WeekFreshnessBadge({ freshness, pressure }: WeekFreshnessBadgeProps) {
  const config: Record<Freshness, { variant: "success" | "warning" | "muted"; label: string }> = {
    fresh: { variant: "success", label: "Fresh" },
    fading: { variant: "warning", label: "Fading" },
    stale: { variant: "muted", label: "Stale" },
  };

  const { variant, label } = config[freshness];

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant}>{label}</Badge>
      <span>{Math.round(pressure * 100)}%</span>
    </div>
  );
}