import type { Load, LoadFilters, SourceInfo } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function buildQuery(filters: LoadFilters): string {
  const params = new URLSearchParams();

  if (filters.origin_state) params.set("origin_state", filters.origin_state);
  if (filters.destination_state) params.set("destination_state", filters.destination_state);
  if (filters.min_rate != null) params.set("min_rate", String(filters.min_rate));
  if (filters.max_rate != null) params.set("max_rate", String(filters.max_rate));
  if (filters.pickup_from) params.set("pickup_from", filters.pickup_from);
  if (filters.pickup_to) params.set("pickup_to", filters.pickup_to);

  filters.equipment?.forEach((e) => params.append("equipment", e));
  filters.source?.forEach((s) => params.append("source", s));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchLoads(filters: LoadFilters): Promise<Load[]> {
  const res = await fetch(`${BASE_URL}/api/loads${buildQuery(filters)}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch loads: ${res.status}`);
  return res.json() as Promise<Load[]>;
}

export async function fetchLoadById(id: string): Promise<Load> {
  const res = await fetch(`${BASE_URL}/api/loads/${id}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Load ${id} not found`);
  return res.json() as Promise<Load>;
}

export async function fetchSources(): Promise<SourceInfo[]> {
  const res = await fetch(`${BASE_URL}/api/sources`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json() as Promise<SourceInfo[]>;
}
