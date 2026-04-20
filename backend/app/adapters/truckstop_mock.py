"""Mock adapter for the Truckstop (Truckstop.com) load board.

Returns seeded data from data/truckstop_loads.json. In a real integration this
class would authenticate against the Truckstop API (subscription + token
required) and map the response fields to the unified Load schema.

Truckstop overlaps some lanes with DAT deliberately — the aggregator surfaces
this, giving dispatchers competitive rate context on the same lane.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.adapters.base import LoadBoardAdapter
from app.schemas import Load, LoadFilters, LoadSource

_DATA_FILE = Path(__file__).parent.parent.parent / "data" / "truckstop_loads.json"


class TruckstopMockAdapter(LoadBoardAdapter):
    """Broker-posted loads sourced from the Truckstop mock dataset.

    Every load has broker contact information populated, matching Truckstop's
    broker-facing marketplace model.
    """

    source = LoadSource.TRUCKSTOP

    def __init__(self) -> None:
        raw = json.loads(_DATA_FILE.read_text(encoding="utf-8"))
        self._loads = [Load.model_validate(item) for item in raw]

    async def fetch_loads(self, filters: LoadFilters) -> list[Load]:
        return self._apply_filters(self._loads, filters)
