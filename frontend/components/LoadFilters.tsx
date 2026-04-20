"use client";

import { X } from "lucide-react";
import type { Equipment, LoadFilters as FiltersType, LoadSource } from "@/lib/types";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: "van", label: "Dry Van" },
  { value: "reefer", label: "Reefer" },
  { value: "flatbed", label: "Flatbed" },
  { value: "power_only", label: "Power Only" },
  { value: "step_deck", label: "Step Deck" },
];

const SOURCE_OPTIONS: { value: LoadSource; label: string }[] = [
  { value: "dat", label: "DAT" },
  { value: "truckstop", label: "Truckstop" },
  { value: "amazon_relay", label: "Amazon Relay" },
];

interface LoadFiltersProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

function StateSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Any state</option>
        {US_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (v: T[]) => void;
}) {
  function toggle(value: T) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="space-y-1.5">
        {options.map(({ value, label: optLabel }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => toggle(value)}
              className="h-3.5 w-3.5 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">{optLabel}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function RateRange({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number | undefined;
  max: number | undefined;
  onMinChange: (v: number | undefined) => void;
  onMaxChange: (v: number | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Rate Range (USD)
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={min ?? ""}
          min={0}
          onChange={(e) => onMinChange(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <span className="text-muted-foreground text-sm">–</span>
        <input
          type="number"
          placeholder="Max"
          value={max ?? ""}
          min={0}
          onChange={(e) => onMaxChange(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}

function activeFilterCount(filters: FiltersType): number {
  let n = 0;
  if (filters.origin_state) n++;
  if (filters.destination_state) n++;
  if (filters.equipment?.length) n++;
  if (filters.source?.length) n++;
  if (filters.min_rate != null || filters.max_rate != null) n++;
  return n;
}

export function LoadFilters({ filters, onChange }: LoadFiltersProps) {
  const count = activeFilterCount(filters);

  function reset() {
    onChange({});
  }

  return (
    <aside className="w-56 shrink-0 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Filters</span>
        {count > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear {count}
          </button>
        )}
      </div>

      <StateSelect
        label="Origin State"
        value={filters.origin_state}
        onChange={(v) => onChange({ ...filters, origin_state: v })}
      />

      <StateSelect
        label="Destination State"
        value={filters.destination_state}
        onChange={(v) => onChange({ ...filters, destination_state: v })}
      />

      <CheckboxGroup
        label="Equipment"
        options={EQUIPMENT_OPTIONS}
        selected={filters.equipment ?? []}
        onChange={(v) => onChange({ ...filters, equipment: v })}
      />

      <RateRange
        min={filters.min_rate}
        max={filters.max_rate}
        onMinChange={(v) => onChange({ ...filters, min_rate: v })}
        onMaxChange={(v) => onChange({ ...filters, max_rate: v })}
      />

      <CheckboxGroup
        label="Source"
        options={SOURCE_OPTIONS}
        selected={filters.source ?? []}
        onChange={(v) => onChange({ ...filters, source: v })}
      />
    </aside>
  );
}
