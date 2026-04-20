"""Mock adapter for the DAT load board.

Returns seeded data from data/dat_loads.json. In a real integration this class
would call the DAT One API (partnership + OAuth2 required) and normalize the
response into the unified Load schema before returning.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.adapters.base import LoadBoardAdapter
from app.schemas import Load, LoadFilters, LoadSource

_DATA_FILE = Path(__file__).parent.parent.parent / "data" / "dat_loads.json"


class DATMockAdapter(LoadBoardAdapter):
    """Broker-posted loads sourced from the DAT mock dataset.

    Every load in this adapter has broker contact information populated —
    consistent with how DAT operates as a broker-to-carrier marketplace.
    """

    source = LoadSource.DAT

    def __init__(self) -> None:
        raw = json.loads(_DATA_FILE.read_text(encoding="utf-8"))
        self._loads = [Load.model_validate(item) for item in raw]

    async def fetch_loads(self, filters: LoadFilters) -> list[Load]:
        return self._apply_filters(self._loads, filters)
