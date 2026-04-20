"""Abstract base class that every load board adapter must implement."""

from abc import ABC, abstractmethod

from app.schemas import Load, LoadFilters, LoadSource


class LoadBoardAdapter(ABC):
    """Contract for all load board integrations, mock or real."""

    source: LoadSource

    @abstractmethod
    async def fetch_loads(self, filters: LoadFilters) -> list[Load]:
        """Return loads matching *filters* from this source.

        Implementations should apply filters as early as possible (ideally at
        the data-source level) to avoid returning large unfiltered payloads to
        the aggregator.
        """
        ...

    def _apply_filters(self, loads: list[Load], filters: LoadFilters) -> list[Load]:
        """In-memory filter pass — used by mock adapters that load everything upfront."""
        result = loads

        if filters.origin_state:
            result = [l for l in result if l.origin_state == filters.origin_state.upper()]

        if filters.destination_state:
            result = [l for l in result if l.destination_state == filters.destination_state.upper()]

        if filters.equipment:
            result = [l for l in result if l.equipment in filters.equipment]

        if filters.min_rate is not None:
            result = [
                l for l in result
                if l.rate_total_usd is not None and l.rate_total_usd >= filters.min_rate
            ]

        if filters.max_rate is not None:
            result = [
                l for l in result
                if l.rate_total_usd is not None and l.rate_total_usd <= filters.max_rate
            ]

        if filters.source:
            result = [l for l in result if l.source in filters.source]

        if filters.pickup_from:
            result = [l for l in result if l.pickup_date >= filters.pickup_from]

        if filters.pickup_to:
            result = [l for l in result if l.pickup_date <= filters.pickup_to]

        return result
