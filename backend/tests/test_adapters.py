"""Tests for load board adapters, aggregator, and API routes."""

from __future__ import annotations

from datetime import date

import pytest
from fastapi.testclient import TestClient

from app.adapters.amazon_relay_mock import AmazonRelayMockAdapter
from app.adapters.dat_mock import DATMockAdapter
from app.adapters.truckstop_mock import TruckstopMockAdapter
from app.aggregator import fetch_all_loads, fetch_load_by_id, get_source_info
from app.main import app
from app.schemas import Equipment, Load, LoadFilters, LoadSource


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture()
def dat() -> DATMockAdapter:
    return DATMockAdapter()


@pytest.fixture()
def truckstop() -> TruckstopMockAdapter:
    return TruckstopMockAdapter()


@pytest.fixture()
def amazon_relay() -> AmazonRelayMockAdapter:
    return AmazonRelayMockAdapter()


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


# ---------------------------------------------------------------------------
# Schema validation
# ---------------------------------------------------------------------------


async def test_dat_returns_valid_loads(dat: DATMockAdapter) -> None:
    loads = await dat.fetch_loads(LoadFilters())
    assert len(loads) > 0
    for load in loads:
        assert isinstance(load, Load)
        assert load.source == LoadSource.DAT
        assert load.id.startswith("dat_")
        assert len(load.origin_state) == 2
        assert len(load.destination_state) == 2
        assert isinstance(load.pickup_date, date)


async def test_truckstop_returns_valid_loads(truckstop: TruckstopMockAdapter) -> None:
    loads = await truckstop.fetch_loads(LoadFilters())
    assert len(loads) > 0
    for load in loads:
        assert isinstance(load, Load)
        assert load.source == LoadSource.TRUCKSTOP
        assert load.id.startswith("ts_")


async def test_amazon_relay_returns_valid_loads(amazon_relay: AmazonRelayMockAdapter) -> None:
    loads = await amazon_relay.fetch_loads(LoadFilters())
    assert len(loads) > 0
    for load in loads:
        assert isinstance(load, Load)
        assert load.source == LoadSource.AMAZON_RELAY
        assert load.id.startswith("ar_")


# ---------------------------------------------------------------------------
# Broker invariants
# ---------------------------------------------------------------------------


async def test_dat_loads_always_have_broker(dat: DATMockAdapter) -> None:
    loads = await dat.fetch_loads(LoadFilters())
    for load in loads:
        assert load.broker is not None, f"{load.id} missing broker"
        assert load.broker.company_name
        assert load.broker.mc_number


async def test_truckstop_loads_always_have_broker(truckstop: TruckstopMockAdapter) -> None:
    loads = await truckstop.fetch_loads(LoadFilters())
    for load in loads:
        assert load.broker is not None, f"{load.id} missing broker"
        assert load.broker.company_name


async def test_amazon_relay_loads_never_have_broker(amazon_relay: AmazonRelayMockAdapter) -> None:
    loads = await amazon_relay.fetch_loads(LoadFilters())
    for load in loads:
        assert load.broker is None, f"{load.id} should not have a broker"


# ---------------------------------------------------------------------------
# Filter correctness
# ---------------------------------------------------------------------------


async def test_filter_by_origin_state(dat: DATMockAdapter) -> None:
    filters = LoadFilters(origin_state="CA")
    loads = await dat.fetch_loads(filters)
    assert all(l.origin_state == "CA" for l in loads)
    assert len(loads) > 0


async def test_filter_by_destination_state(dat: DATMockAdapter) -> None:
    filters = LoadFilters(destination_state="TX")
    loads = await dat.fetch_loads(filters)
    assert all(l.destination_state == "TX" for l in loads)


async def test_filter_by_equipment(dat: DATMockAdapter) -> None:
    filters = LoadFilters(equipment=[Equipment.REEFER])
    loads = await dat.fetch_loads(filters)
    assert all(l.equipment == Equipment.REEFER for l in loads)
    assert len(loads) > 0


async def test_filter_by_multiple_equipment_types(dat: DATMockAdapter) -> None:
    filters = LoadFilters(equipment=[Equipment.VAN, Equipment.FLATBED])
    loads = await dat.fetch_loads(filters)
    for load in loads:
        assert load.equipment in (Equipment.VAN, Equipment.FLATBED)


async def test_filter_by_min_rate(dat: DATMockAdapter) -> None:
    filters = LoadFilters(min_rate=2000.0)
    loads = await dat.fetch_loads(filters)
    for load in loads:
        assert load.rate_total_usd is not None
        assert load.rate_total_usd >= 2000.0


async def test_filter_by_max_rate(dat: DATMockAdapter) -> None:
    filters = LoadFilters(max_rate=600.0)
    loads = await dat.fetch_loads(filters)
    for load in loads:
        assert load.rate_total_usd is not None
        assert load.rate_total_usd <= 600.0


async def test_filter_by_pickup_from(dat: DATMockAdapter) -> None:
    cutoff = date(2026, 4, 22)
    filters = LoadFilters(pickup_from=cutoff)
    loads = await dat.fetch_loads(filters)
    assert all(l.pickup_date >= cutoff for l in loads)


async def test_filter_by_pickup_to(dat: DATMockAdapter) -> None:
    cutoff = date(2026, 4, 21)
    filters = LoadFilters(pickup_to=cutoff)
    loads = await dat.fetch_loads(filters)
    assert all(l.pickup_date <= cutoff for l in loads)


async def test_empty_filter_returns_no_loads_for_impossible_state(dat: DATMockAdapter) -> None:
    filters = LoadFilters(origin_state="ZZ")
    loads = await dat.fetch_loads(filters)
    assert loads == []


# ---------------------------------------------------------------------------
# Aggregator
# ---------------------------------------------------------------------------


async def test_aggregator_merges_all_sources() -> None:
    loads = await fetch_all_loads(LoadFilters())
    sources = {l.source for l in loads}
    assert LoadSource.DAT in sources
    assert LoadSource.TRUCKSTOP in sources
    assert LoadSource.AMAZON_RELAY in sources


async def test_aggregator_sorted_by_posted_at_desc() -> None:
    loads = await fetch_all_loads(LoadFilters())
    for i in range(len(loads) - 1):
        assert loads[i].posted_at >= loads[i + 1].posted_at


async def test_aggregator_source_filter() -> None:
    filters = LoadFilters(source=[LoadSource.DAT])
    loads = await fetch_all_loads(filters)
    assert all(l.source == LoadSource.DAT for l in loads)


async def test_fetch_load_by_id_dat() -> None:
    load = await fetch_load_by_id("dat_00001")
    assert load is not None
    assert load.id == "dat_00001"
    assert load.source == LoadSource.DAT


async def test_fetch_load_by_id_amazon_relay() -> None:
    load = await fetch_load_by_id("ar_00001")
    assert load is not None
    assert load.broker is None


async def test_fetch_load_by_id_not_found() -> None:
    load = await fetch_load_by_id("dat_99999")
    assert load is None


async def test_get_source_info() -> None:
    info = await get_source_info()
    assert len(info) == 3
    for s in info:
        assert s.load_count > 0


# ---------------------------------------------------------------------------
# HTTP API (integration)
# ---------------------------------------------------------------------------


def test_api_list_loads(client: TestClient) -> None:
    response = client.get("/api/loads")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_api_filter_by_origin_state(client: TestClient) -> None:
    response = client.get("/api/loads?origin_state=TX")
    assert response.status_code == 200
    for load in response.json():
        assert load["origin_state"] == "TX"


def test_api_filter_by_equipment(client: TestClient) -> None:
    response = client.get("/api/loads?equipment=reefer")
    assert response.status_code == 200
    for load in response.json():
        assert load["equipment"] == "reefer"


def test_api_filter_by_source(client: TestClient) -> None:
    response = client.get("/api/loads?source=amazon_relay")
    assert response.status_code == 200
    for load in response.json():
        assert load["source"] == "amazon_relay"
        assert load["broker"] is None


def test_api_get_load_by_id(client: TestClient) -> None:
    response = client.get("/api/loads/dat_00001")
    assert response.status_code == 200
    assert response.json()["id"] == "dat_00001"


def test_api_get_load_not_found(client: TestClient) -> None:
    response = client.get("/api/loads/dat_99999")
    assert response.status_code == 404


def test_api_sources(client: TestClient) -> None:
    response = client.get("/api/sources")
    assert response.status_code == 200
    sources = {s["source"] for s in response.json()}
    assert "dat" in sources
    assert "truckstop" in sources
    assert "amazon_relay" in sources


def test_api_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
