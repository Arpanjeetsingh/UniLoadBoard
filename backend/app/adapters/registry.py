"""Adapter registry — single place to register and look up load board adapters.

Adding a new load board means: create an adapter module, instantiate it here.
No other file needs to change.
"""

from __future__ import annotations

from app.adapters.amazon_relay_mock import AmazonRelayMockAdapter
from app.adapters.base import LoadBoardAdapter
from app.adapters.dat_mock import DATMockAdapter
from app.adapters.truckstop_mock import TruckstopMockAdapter
from app.schemas import LoadSource

_adapters: list[LoadBoardAdapter] = [
    DATMockAdapter(),
    TruckstopMockAdapter(),
    AmazonRelayMockAdapter(),
]

_adapter_map: dict[LoadSource, LoadBoardAdapter] = {a.source: a for a in _adapters}


def get_all_adapters() -> list[LoadBoardAdapter]:
    return _adapters


def get_adapter(source: LoadSource) -> LoadBoardAdapter | None:
    return _adapter_map.get(source)
