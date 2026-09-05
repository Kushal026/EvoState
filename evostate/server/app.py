"""FastAPI Application factory and configuration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from evostate.server.routes import router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="DataForge: Evolving Memory Lab API",
        description=(
            "Computational experiment engine for analyzing Long-Horizon Evolving States "
            "and Inference-Time Scaling. Features baseline comparison between Full-History "
            "KV Cache, Fixed-Size Recurrence, and Educational Evolving Memory Toy."
        ),
        version="1.0.0"
    )

    # Allow CORS for future dashboard integration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)
    return app


app = create_app()
