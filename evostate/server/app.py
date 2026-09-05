"""FastAPI Application factory, OpenAPI configuration, and CORS middleware for DataForge."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from evostate.server.routes import router


TAGS_METADATA = [
    {
        "name": "DataForge Experiments",
        "description": "Endpoints for executing live experiments, retrieving precomputed benchmarks, and evaluating evolving state dynamics."
    }
]


def create_app() -> FastAPI:
    """Create and configure the DataForge FastAPI service."""
    app = FastAPI(
        title="DataForge: Evolving Memory Lab API",
        description="""
# DataForge: Evolving Memory Lab API
**Pathway Track 2026 — Research & Educational Computation Engine**

### Central Falsifiable Claim:
> *"A fixed-size evolving state can carry useful information across sequences without storing every previous token, but increasing sequence length and conflicting updates can cause interference and information loss; additional inference-time computation can sometimes improve recovery."*

### Key Features:
- **Baseline Models:** Full-History KV Cache ($O(T)$), Fixed-Size Recurrence ($O(d)$), and Educational Evolving Toy ($O(1)$).
- **Core Experiments:** Delayed Recall, Long-Horizon Clutter, Interference & Overwrite, Memory Capacity, and Inference-Time Compute Scaling.
- **Execution Modes:** `live` (computed in real-time) and `precomputed` (offline verified benchmarks).
- **Scientific Integrity:** Input guardrails, non-fabricated metrics, and explicit educational surrogate boundaries.
        """,
        version="1.0.0",
        openapi_tags=TAGS_METADATA,
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # CORS Configuration for Next.js frontend (ports 3000, 3001, and production origins)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
            "*"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount routes at root level (/health, /experiment/recall, etc.)
    app.include_router(router)

    # Also mount with /api prefix for Next.js proxying convenience
    app.include_router(router, prefix="/api")

    return app


app = create_app()
