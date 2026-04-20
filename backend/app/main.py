"""FastAPI application entry point for the Unified Load Board backend."""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.loads import router

load_dotenv()

app = FastAPI(
    title="Unified Load Board API",
    description=(
        "Aggregates loads from multiple load board adapters (DAT, Truckstop, Amazon Relay) "
        "into a single normalized interface. Mock adapters are used in place of real API "
        "integrations — see docs/adapters.md for how to add a real integration."
    ),
    version="0.1.0",
)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
