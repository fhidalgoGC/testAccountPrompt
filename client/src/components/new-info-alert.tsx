import { Bell } from "lucide-react";

interface NewInfoAlertProps {
  show: boolean;
}

export function NewInfoAlert({ show }: NewInfoAlertProps) {
  if (!show) return null;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium animate-pulse"
      data-testid="alert-new-info"
    >
      <Bell className="h-3 w-3" />
      Nueva Información
    </div>
  );
}
