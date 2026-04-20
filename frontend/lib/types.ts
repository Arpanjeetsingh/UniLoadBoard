/** Unified Load schema — mirrors backend/app/schemas.py exactly. */

export type Equipment = "van" | "reefer" | "flatbed" | "power_only" | "step_deck";

export type LoadSource = "dat" | "truckstop" | "amazon_relay";

export interface BrokerContact {
  company_name: string;
  mc_number: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
}

export interface Load {
  id: string;
  source: LoadSource;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  equipment: Equipment;
  weight_lbs: number | null;
  length_ft: number | null;
  rate_total_usd: number | null;
  rate_per_mile_usd: number | null;
  distance_miles: number | null;
  pickup_date: string;
  delivery_date: string | null;
  broker: BrokerContact | null;
  posted_at: string;
  notes: string | null;
}

export interface SourceInfo {
  source: LoadSource;
  load_count: number;
}

export interface LoadFilters {
  origin_state?: string;
  destination_state?: string;
  equipment?: Equipment[];
  min_rate?: number;
  max_rate?: number;
  source?: LoadSource[];
  pickup_from?: string;
  pickup_to?: string;
}

export type SortKey = "posted_at" | "pickup_date" | "rate_total_usd" | "rate_per_mile_usd" | "distance_miles";
export type SortDir = "asc" | "desc";
