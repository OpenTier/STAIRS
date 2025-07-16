# Copyright (c) 2025 by OpenTier GmbH
# SPDX‑FileCopyrightText: 2025 OpenTier GmbH
# SPDX‑License‑Identifier: MIT

# This file is part of OpenTier.

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from fastapi import FastAPI
from device_gateway.configuration import Configuration
from starlette.middleware.cors import CORSMiddleware
from device_gateway.api.devices import router as device_router
from device_gateway.api.devices import twin_service
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
app.include_router(health_router, tags=["health"])
