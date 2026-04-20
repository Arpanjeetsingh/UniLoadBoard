"""Unified Load schema shared across all adapters and API routes."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field


class Equipment(str, Enum):
    VAN = "van"
    REEFER = "reefer"
    FLATBED = "flatbed"
    POWER_ONLY = "power_only"
    STEP_DECK = "step_deck"


class LoadSource(str, Enum):
    DAT = "dat"
    TRUCKSTOP = "truckstop"
    AMAZON_RELAY = "amazon_relay"


class BrokerContact(BaseModel):
    company_name: str
    mc_number: str | None = None
    contact_name: str | None = None
    phone: str | None = None
    email: str | None = None


class Load(BaseModel):
    id: str
    source: LoadSource
    origin_city: str
    origin_state: str = Field(..., min_length=2, max_length=2)
    destination_city: str
    destination_state: str = Field(..., min_length=2, max_length=2)
    equipment: Equipment
    weight_lbs: int | None = None
    length_ft: int | None = None
    rate_total_usd: float | None = None
    rate_per_mile_usd: float | None = None
    distance_miles: int | None = None
    pickup_date: date
    delivery_date: date | None = None
    broker: BrokerContact | None = None
    posted_at: datetime
    notes: str | None = None


class LoadFilters(BaseModel):
    origin_state: str | None = None
    destination_state: str | None = None
    equipment: list[Equipment] = Field(default_factory=list)
    min_rate: float | None = None
    max_rate: float | None = None
    source: list[LoadSource] = Field(default_factory=list)
    pickup_from: date | None = None
    pickup_to: date | None = None


class SourceInfo(BaseModel):
    source: LoadSource
    load_count: int
