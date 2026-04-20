# Adding a New Load Board Adapter

This guide walks through adding a new load board to the Unified Load Board. The whole process takes one file and one line in the registry.

## 1. Create the adapter file

Create `backend/app/adapters/myboard_mock.py` (or `myboard.py` for a real integration):

```python
"""Adapter for MyBoard load board."""

from __future__ import annotations

import json
from pathlib import Path

from app.adapters.base import LoadBoardAdapter
from app.schemas import Load, LoadFilters, LoadSource

# Add your new source to LoadSource enum in schemas.py first:
# MYBOARD = "myboard"

_DATA_FILE = Path(__file__).parent.parent.parent / "data" / "myboard_loads.json"


class MyBoardMockAdapter(LoadBoardAdapter):
    """Mock adapter for MyBoard.

    Replace this with a real HTTP client once you have API credentials.
    """

    source = LoadSource.MYBOARD  # type: ignore[attr-defined]

    def __init__(self) -> None:
        raw = json.loads(_DATA_FILE.read_text(encoding="utf-8"))
        self._loads = [Load.model_validate(item) for item in raw]

    async def fetch_loads(self, filters: LoadFilters) -> list[Load]:
        return self._apply_filters(self._loads, filters)
```

## 2. Register it

Open `backend/app/adapters/registry.py` and add two lines:

```python
from app.adapters.myboard_mock import MyBoardMockAdapter  # add this

_adapters: list[LoadBoardAdapter] = [
    DATMockAdapter(),
    TruckstopMockAdapter(),
    AmazonRelayMockAdapter(),
    MyBoardMockAdapter(),               # add this
]
```

That's it. The aggregator, `/api/loads`, `/api/sources`, and the frontend all automatically include your new source.

## 3. Add a source badge color (frontend)

Open `frontend/components/SourceBadge.tsx` and add an entry:

```typescript
const SOURCE_CONFIG: Record<LoadSource, { label: string; className: string }> = {
  // ...existing entries...
  myboard: {
    label: "MyBoard",
    className: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
  },
};
```

Also add `"myboard"` to the `LoadSource` union in `frontend/lib/types.ts`.

## Real API Integration Pattern

For a real API (not a mock), the `fetch_loads` method should:
1. Authenticate (OAuth2, API key, etc.)
2. Call the API with filter parameters pushed server-side where possible
3. Map the API response fields to the `Load` schema
4. Return the list — no `_apply_filters` needed if the API filtered correctly

```python
async def fetch_loads(self, filters: LoadFilters) -> list[Load]:
    params = {
        "originState": filters.origin_state,
        "destinationState": filters.destination_state,
        "equipmentTypes": [e.value for e in filters.equipment],
        # ... map other filters to API params ...
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.myboard.com/v2/loads",
            params={k: v for k, v in params.items() if v},
            headers={"Authorization": f"Bearer {self._token}"},
            timeout=10.0,
        )
        response.raise_for_status()
        raw = response.json()["loads"]
    return [self._normalize(item) for item in raw]

def _normalize(self, raw: dict) -> Load:
    return Load(
        id=f"myboard_{raw['loadId']}",
        source=LoadSource.MYBOARD,
        origin_city=raw["pickup"]["city"],
        origin_state=raw["pickup"]["state"],
        # ... map all fields ...
    )
```

## Seed data format

Mock adapters read from `backend/data/<source>_loads.json`. Each entry must be a valid `Load` object — Pydantic will validate at startup and raise immediately if any field is malformed.

Minimum required fields:
```json
{
  "id": "myboard_00001",
  "source": "myboard",
  "origin_city": "Chicago",
  "origin_state": "IL",
  "destination_city": "Dallas",
  "destination_state": "TX",
  "equipment": "van",
  "pickup_date": "2026-04-21",
  "posted_at": "2026-04-19T08:00:00Z"
}
```

All other fields are optional (`null`/`None`).

## Broker vs. direct-shipper

Set `broker` to a `BrokerContact` object for broker-posted loads. Set `broker` to `null` for direct-shipper sources (like Amazon Relay). The frontend automatically renders the right contact card based on this field.
