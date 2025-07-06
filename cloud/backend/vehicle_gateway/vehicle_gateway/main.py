from fastapi import FastAPI
from vehicle_gateway.configuration import Configuration
from starlette.middleware.cors import CORSMiddleware
from vehicle_gateway.api.vehicles import router as vehicle_router
from vehicle_gateway.api.vehicles import twin_service
from vehicle_gateway.api.robots import router as robot_router
from vehicle_gateway.api.health import router as health_router
import logging
from contextlib import asynccontextmanager
import os


log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start Twin Service
    await twin_service.start()
    yield
    # Stop Twin Service
    twin_service.stop()


app = FastAPI(title="Vehicle Gateway", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        str(origin).strip("/") for origin in Configuration.BACKEND_CORS_ORIGINS
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicle_router, tags=["vehicles"])
app.include_router(robot_router, tags=["robots"])
app.include_router(health_router, tags=["health"])
