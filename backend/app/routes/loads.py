"""API routes for load board data."""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.aggregator import fetch_all_loads, fetch_load_by_id, get_source_info
from app.schemas import Equipment, Load, LoadFilters, LoadSource, SourceInfo

router = APIRouter(prefix="/api")


@router.get("/loads", response_model=list[Load], summary="List loads with optional filters")
async def list_loads(
    origin_state: str | None = Query(None, description="2-letter origin state code"),
    destination_state: str | None = Query(None, description="2-letter destination state code"),
    equipment: list[Equipment] = Query(default=[], description="Equipment type(s)"),
    min_rate: float | None = Query(None, description="Minimum total rate in USD"),
    max_rate: float | None = Query(None, description="Maximum total rate in USD"),
    source: list[LoadSource] = Query(default=[], description="Load board source(s)"),
    pickup_from: date | None = Query(None, description="Earliest pickup date (YYYY-MM-DD)"),
    pickup_to: date | None = Query(None, description="Latest pickup date (YYYY-MM-DD)"),
) -> list[Load]:
    """Return loads from all registered adapters, merged and sorted by post time.

    All query parameters are optional. Multiple values for *equipment* and
    *source* are passed as repeated query params (e.g. `?equipment=van&equipment=reefer`).
    """
    filters = LoadFilters(
        origin_state=origin_state,
        destination_state=destination_state,
        equipment=equipment,
        min_rate=min_rate,
        max_rate=max_rate,
        source=source,
        pickup_from=pickup_from,
        pickup_to=pickup_to,
    )
    return await fetch_all_loads(filters)


@router.get("/loads/{load_id}", response_model=Load, summary="Get a single load by ID")
async def get_load(load_id: str) -> Load:
    """Return full detail for a single load.

    The source is inferred from the ID prefix (e.g. ``dat_``, ``ts_``, ``ar_``).
    """
    load = await fetch_load_by_id(load_id)
    if load is None:
        raise HTTPException(status_code=404, detail=f"Load '{load_id}' not found")
    return load


@router.get("/sources", response_model=list[SourceInfo], summary="List registered adapters")
async def list_sources() -> list[SourceInfo]:
    """Return each registered load board adapter and its current load count."""
    return await get_source_info()
