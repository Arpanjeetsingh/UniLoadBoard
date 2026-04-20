"""Aggregator — fans out to all registered adapters in parallel, merges results.

The aggregator is the core of the unified load board architecture. It is
intentionally decoupled from both the adapters (it only knows the abstract
interface) and the API layer (it returns plain Load objects, not HTTP responses).
"""

from __future__ import annotations

import asyncio

from app.adapters.registry import get_all_adapters, get_adapter
from app.schemas import Load, LoadFilters, LoadSource, SourceInfo


async def fetch_all_loads(filters: LoadFilters) -> list[Load]:
    """Fan out to all adapters in parallel, merge, and sort by posted_at desc."""
    adapters = get_all_adapters()

    if filters.source:
        adapters = [a for a in adapters if a.source in filters.source]

    results: list[list[Load]] = await asyncio.gather(
        *[adapter.fetch_loads(filters) for adapter in adapters]
    )

    merged: list[Load] = [load for batch in results for load in batch]
    merged.sort(key=lambda l: l.posted_at, reverse=True)
    return merged


async def fetch_load_by_id(load_id: str) -> Load | None:
    """Look up a single load by its prefixed ID (e.g. 'dat_00042')."""
    source = _infer_source(load_id)
    if source is None:
        return None

    adapter = get_adapter(source)
    if adapter is None:
        return None

    loads = await adapter.fetch_loads(LoadFilters())
    return next((l for l in loads if l.id == load_id), None)


async def get_source_info() -> list[SourceInfo]:
    """Return each registered adapter with its current load count."""
    adapters = get_all_adapters()
    counts: list[int] = await asyncio.gather(
        *[_count_loads(a.fetch_loads(LoadFilters())) for a in adapters]
    )
    return [SourceInfo(source=a.source, load_count=c) for a, c in zip(adapters, counts)]


async def _count_loads(coro) -> int:  # type: ignore[type-arg]
    return len(await coro)


def _infer_source(load_id: str) -> LoadSource | None:
    prefix_map = {
        "dat_": LoadSource.DAT,
        "ts_": LoadSource.TRUCKSTOP,
        "ar_": LoadSource.AMAZON_RELAY,
    }
    for prefix, source in prefix_map.items():
        if load_id.startswith(prefix):
            return source
    return None
