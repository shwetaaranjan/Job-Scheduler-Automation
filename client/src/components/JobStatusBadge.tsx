import { cn } from "@/lib/utils";

const statusStyles = {
  pending: "bg-slate-100 text-slate-600 border-slate-200",
  running: "bg-blue-50 text-blue-600 border-blue-200 animate-pulse",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  failed: "bg-red-50 text-red-600 border-red-200",
};

const priorityStyles = {
  Low: "text-slate-500 bg-slate-100 border-slate-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  High: "text-rose-600 bg-rose-50 border-rose-200",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.pending;
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider",
      style,
      className
    )}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const style = priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles.Low;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
      style,
      className
    )}>
      {priority}
    </span>
  );
}
