"""Mock adapter for Amazon Relay.

Returns seeded data from data/amazon_relay_loads.json. Amazon Relay is a
carrier-facing freight program run directly by Amazon — Amazon is the shipper,
so there is no broker intermediary. Every load in this adapter has broker=None
and uses the notes field to convey facility/appointment context.

Amazon Relay does have an API, but access requires a formal request and approval
from the Amazon Relay partnerships team, which is rarely granted to external
carriers. The schema and field mapping in this adapter are modeled after the real
Amazon Relay API, based on direct experience integrating with it at multiple
trucking operations.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.adapters.base import LoadBoardAdapter
from app.schemas import Load, LoadFilters, LoadSource

_DATA_FILE = Path(__file__).parent.parent.parent / "data" / "amazon_relay_loads.json"


class AmazonRelayMockAdapter(LoadBoardAdapter):
    """Direct-shipper loads sourced from the Amazon Relay mock dataset.

    broker is always None — Amazon is the shipper. Facility details and
    appointment instructions are conveyed through the notes field.
    """

    source = LoadSource.AMAZON_RELAY

    def __init__(self) -> None:
        raw = json.loads(_DATA_FILE.read_text(encoding="utf-8"))
        self._loads = [Load.model_validate(item) for item in raw]

    async def fetch_loads(self, filters: LoadFilters) -> list[Load]:
        return self._apply_filters(self._loads, filters)
