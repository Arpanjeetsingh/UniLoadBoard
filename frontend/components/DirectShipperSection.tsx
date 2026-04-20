import { Truck, Info } from "lucide-react";
import type { LoadSource } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";

interface DirectShipperSectionProps {
  source: LoadSource;
  notes: string | null;
}

export function DirectShipperSection({ source, notes }: DirectShipperSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h3 className="font-semibold text-base text-foreground">Direct Shipper</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Posted by</span>
            <SourceBadge source={source} />
          </div>
        </div>

        {notes && (
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">{notes}</p>
          </div>
        )}

        {!notes && (
          <p className="text-sm text-muted-foreground pl-7">
            No additional facility notes. Use the Amazon Relay app to check in at pickup.
          </p>
        )}
      </div>
    </div>
  );
}
