import { Badge } from "@/components/ui/badge";
import { ProcessStatus, type ProcessStatusType } from "@shared/schema";
import { Clock, AlertCircle, CheckCircle, Eye, Lock } from "lucide-react";

interface StatusBadgeProps {
  status: ProcessStatusType;
  size?: "sm" | "default";
}

const statusConfig: Record<
  ProcessStatusType,
  { label: string; className: string; icon: typeof Clock }
> = {
  [ProcessStatus.PENDING_REVIEW]: {
    label: "Pendiente de Revisión",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    icon: Clock,
  },
  [ProcessStatus.INCOMPLETE]: {
    label: "Incompleto",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    icon: AlertCircle,
  },
  [ProcessStatus.CORRECTED]: {
    label: "Corregido",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    icon: CheckCircle,
  },
  [ProcessStatus.IN_REVIEW]: {
    label: "En Revisión",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    icon: Eye,
  },
  [ProcessStatus.FINALIZED]: {
    label: "Finalizado",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    icon: Lock,
  },
};

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig[ProcessStatus.PENDING_REVIEW];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${size === "sm" ? "text-xs px-2 py-0.5" : "px-3 py-1"} font-medium gap-1.5`}
      data-testid={`badge-status-${status}`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {config.label}
    </Badge>
  );
}
