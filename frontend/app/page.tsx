"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RefreshCw, Layers } from "lucide-react";
import { LoadTable } from "@/components/LoadTable";
import { LoadFilters } from "@/components/LoadFilters";
import { SourceBadge } from "@/components/SourceBadge";
import { fetchLoads, fetchSources } from "@/lib/api";
import type { Load, LoadFilters as FiltersType, LoadSource, SourceInfo } from "@/lib/types";

function filtersFromParams(params: URLSearchParams): FiltersType {
  const equipment = params.getAll("equipment") as FiltersType["equipment"];
  const source = params.getAll("source") as LoadSource[];
  return {
    origin_state: params.get("origin_state") ?? undefined,
    destination_state: params.get("destination_state") ?? undefined,
    equipment: equipment.length ? equipment : undefined,
    source: source.length ? source : undefined,
    min_rate: params.get("min_rate") ? Number(params.get("min_rate")) : undefined,
    max_rate: params.get("max_rate") ? Number(params.get("max_rate")) : undefined,
  };
}

function filtersToParams(filters: FiltersType): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.origin_state) params.set("origin_state", filters.origin_state);
  if (filters.destination_state) params.set("destination_state", filters.destination_state);
  if (filters.min_rate != null) params.set("min_rate", String(filters.min_rate));
  if (filters.max_rate != null) params.set("max_rate", String(filters.max_rate));
  filters.equipment?.forEach((e) => params.append("equipment", e));
  filters.source?.forEach((s) => params.append("source", s));
  return params;
}

function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loads, setLoads] = useState<Load[]>([]);
  const [sources, setSources] = useState<SourceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersType>(() =>
    filtersFromParams(searchParams)
  );
  const fetchCount = useRef(0);

  const loadData = useCallback(async (f: FiltersType) => {
    const id = ++fetchCount.current;
    setIsLoading(true);
    setError(null);
    try {
      const [data, srcData] = await Promise.all([fetchLoads(f), fetchSources()]);
      if (id !== fetchCount.current) return;
      setLoads(data);
      setSources(srcData);
    } catch {
      if (id !== fetchCount.current) return;
      setError("Could not connect to the backend. Make sure uvicorn is running on port 8000.");
    } finally {
      if (id === fetchCount.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  function handleFilterChange(newFilters: FiltersType) {
    setFilters(newFilters);
    const params = filtersToParams(newFilters);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const totalLoads = sources.reduce((sum, s) => sum + s.load_count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto max-w-screen-xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-foreground" />
            <span className="font-semibold text-foreground">Unified Load Board</span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              {sources.map((s) => (
                <SourceBadge key={s.source} source={s.source} size="sm" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && (
              <span className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{loads.length}</strong>
                {totalLoads > 0 && totalLoads !== loads.length && (
                  <> of <strong className="text-foreground">{totalLoads}</strong></>
                )}{" "}
                loads
              </span>
            )}
            <button
              onClick={() => void loadData(filters)}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-screen-xl px-6 py-6">
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex gap-6">
          <LoadFilters filters={filters} onChange={handleFilterChange} />
          <div className="flex-1 min-w-0">
            <LoadTable loads={loads} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePage />
    </Suspense>
  );
}
