import {
  MapPin,
  Truck,
  Weight,
  Ruler,
  DollarSign,
  Route,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import type { Load } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";
import {
  formatCurrency,
  formatRate,
  formatWeight,
  formatDate,
  formatDateTime,
  cn,
} from "@/lib/utils";

const EQUIPMENT_LABELS: Record<string, string> = {
  van: "Dry Van",
  reefer: "Refrigerated",
  flatbed: "Flatbed",
  power_only: "Power Only",
  step_deck: "Step Deck",
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function DetailRow({ icon, label, value, highlight }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
      <span className={cn("text-sm font-medium flex-1", highlight && "text-green-700")}>
        {value}
      </span>
    </div>
  );
}

interface LoadDetailCardProps {
  load: Load;
}

export function LoadDetailCard({ load }: LoadDetailCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-foreground">
          {load.origin_city}, {load.origin_state} → {load.destination_city},{" "}
          {load.destination_state}
        </h2>
        <SourceBadge source={load.source} />
      </div>

      <div className="divide-y divide-border">
        <DetailRow
          icon={<MapPin className="h-4 w-4" />}
          label="Origin"
          value={`${load.origin_city}, ${load.origin_state}`}
        />
        <DetailRow
          icon={<MapPin className="h-4 w-4" />}
          label="Destination"
          value={`${load.destination_city}, ${load.destination_state}`}
        />
        <DetailRow
          icon={<Truck className="h-4 w-4" />}
          label="Equipment"
          value={EQUIPMENT_LABELS[load.equipment] ?? load.equipment}
        />
        <DetailRow
          icon={<DollarSign className="h-4 w-4" />}
          label="Total Rate"
          value={formatCurrency(load.rate_total_usd)}
          highlight={load.rate_total_usd != null}
        />
        <DetailRow
          icon={<DollarSign className="h-4 w-4" />}
          label="Rate / Mile"
          value={formatRate(load.rate_per_mile_usd)}
        />
        <DetailRow
          icon={<Route className="h-4 w-4" />}
          label="Distance"
          value={load.distance_miles != null ? `${load.distance_miles.toLocaleString()} mi` : "—"}
        />
        <DetailRow
          icon={<Weight className="h-4 w-4" />}
          label="Weight"
          value={formatWeight(load.weight_lbs)}
        />
        <DetailRow
          icon={<Ruler className="h-4 w-4" />}
          label="Length"
          value={load.length_ft != null ? `${load.length_ft} ft` : "—"}
        />
        <DetailRow
          icon={<Calendar className="h-4 w-4" />}
          label="Pickup"
          value={formatDate(load.pickup_date)}
        />
        <DetailRow
          icon={<Calendar className="h-4 w-4" />}
          label="Delivery"
          value={load.delivery_date ? formatDate(load.delivery_date) : "—"}
        />
        <DetailRow
          icon={<Clock className="h-4 w-4" />}
          label="Posted"
          value={formatDateTime(load.posted_at)}
        />
        {load.notes && (
          <DetailRow
            icon={<FileText className="h-4 w-4" />}
            label="Notes"
            value={load.notes}
          />
        )}
      </div>
    </div>
  );
}
