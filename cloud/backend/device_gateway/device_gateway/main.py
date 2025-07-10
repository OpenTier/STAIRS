from fastapi import FastAPI
from device_gateway.configuration import Configuration
from starlette.middleware.cors import CORSMiddleware
from device_gateway.api.devices import router as device_router
from device_gateway.api.devices import twin_service
from device_gateway.api.robots import router as robot_router
from device_gateway.api.health import router as health_router
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


app = FastAPI(title="Device Gateway", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        str(origin).strip("/") for origin in Configuration.BACKEND_CORS_ORIGINS
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(device_router, tags=["devices"])
app.include_router(robot_router, tags=["robots"])
app.include_router(health_router, tags=["health"])
