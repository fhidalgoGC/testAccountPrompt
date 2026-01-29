import { type ReactNode } from "react";
import { FileX, Users, FolderOpen, Search } from "lucide-react";

interface EmptyStateProps {
  icon?: "files" | "users" | "folder" | "search";
  title: string;
  description: string;
  action?: ReactNode;
}

const icons = {
  files: FileX,
  users: Users,
  folder: FolderOpen,
  search: Search,
};

export function EmptyState({ icon = "files", title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}
