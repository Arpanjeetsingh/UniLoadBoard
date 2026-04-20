"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import type { Load, SortKey, SortDir } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";
import { formatCurrency, formatRate, formatWeight, formatDate } from "@/lib/utils";

const EQUIPMENT_LABELS: Record<string, string> = {
  van: "Dry Van",
  reefer: "Reefer",
  flatbed: "Flatbed",
  power_only: "Power Only",
  step_deck: "Step Deck",
};

interface Column {
  key: SortKey | "lane" | "equipment" | "source";
  label: string;
  sortable: boolean;
}

const COLUMNS: Column[] = [
  { key: "lane", label: "Lane", sortable: false },
  { key: "equipment", label: "Equipment", sortable: false },
  { key: "rate_total_usd", label: "Total Rate", sortable: true },
  { key: "rate_per_mile_usd", label: "$/Mile", sortable: true },
  { key: "distance_miles", label: "Miles", sortable: true },
  { key: "weight_lbs" as SortKey, label: "Weight", sortable: false },
  { key: "pickup_date", label: "Pickup", sortable: true },
  { key: "source", label: "Source", sortable: false },
];

function SortIcon({ col, sortKey, sortDir }: { col: string; sortKey: SortKey | null; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return sortDir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-foreground" />
    : <ArrowDown className="h-3.5 w-3.5 text-foreground" />;
}

interface LoadTableProps {
  loads: Load[];
  isLoading: boolean;
}

export function LoadTable({ loads, isLoading }: LoadTableProps) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey | null>("posted_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return loads;
    return [...loads].sort((a, b) => {
      const av = a[sortKey as keyof Load];
      const bv = b[sortKey as keyof Load];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [loads, sortKey, sortDir]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-t border-border">
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (loads.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-sm font-medium">No loads match your filters.</p>
        <p className="text-muted-foreground text-xs mt-1">Try adjusting origin, destination, or rate range.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key as SortKey)}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    {col.label}
                    <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((load, idx) => (
            <tr
              key={load.id}
              onClick={() => router.push(`/loads/${load.id}`)}
              className={`border-t border-border cursor-pointer transition-colors hover:bg-muted/40 ${
                idx % 2 === 0 ? "bg-card" : "bg-muted/20"
              }`}
            >
              <td className="px-4 py-3 font-medium whitespace-nowrap">
                {load.origin_city}, {load.origin_state}{" "}
                <span className="text-muted-foreground">→</span>{" "}
                {load.destination_city}, {load.destination_state}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {EQUIPMENT_LABELS[load.equipment] ?? load.equipment}
              </td>
              <td className="px-4 py-3 font-semibold whitespace-nowrap">
                {load.rate_total_usd != null ? (
                  <span className="text-green-700">{formatCurrency(load.rate_total_usd)}</span>
                ) : (
                  <span className="text-muted-foreground italic text-xs">Call</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {formatRate(load.rate_per_mile_usd)}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {load.distance_miles != null ? `${load.distance_miles.toLocaleString()} mi` : "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {formatWeight(load.weight_lbs)}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {formatDate(load.pickup_date)}
              </td>
              <td className="px-4 py-3">
                <SourceBadge source={load.source} size="sm" />
              </td>
              <td className="px-2 py-3">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
