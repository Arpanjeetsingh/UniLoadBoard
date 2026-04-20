import type { LoadSource } from "@/lib/types";

const SOURCE_CONFIG: Record<
  LoadSource,
  { label: string; className: string }
> = {
  dat: {
    label: "DAT",
    className: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
  },
  truckstop: {
    label: "Truckstop",
    className: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
  },
  amazon_relay: {
    label: "Amazon Relay",
    className: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  },
};

interface SourceBadgeProps {
  source: LoadSource;
  size?: "sm" | "md";
}

export function SourceBadge({ source, size = "md" }: SourceBadgeProps) {
  const { label, className } = SOURCE_CONFIG[source];
  const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded font-medium ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
