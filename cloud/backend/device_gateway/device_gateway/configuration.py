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

import os


class Configuration:
    INFLUXDB_ORG = os.environ.get("INFLUXDB_ORG", "OpenTier")
    INFLUXDB_TOKEN = os.environ.get("INFLUXDB_TOKEN", "my-secret-token")
    INFLUXDB_HOST = os.environ.get("INFLUXDB_HOST", "http://localhost:8086")
    INFLUXDB_BUCKET = os.environ.get("INFLUXDB_BUCKET", "telemetry")
    ZENOH_CLOUD_ENTRYPOINTS = [
        # Cloud entrypoints:
        "tcp/172.20.0.13:7447",
        "udp/172.20.0.13:7447",
        # Local entrypoints:
        "tcp/[::]:7447",
        "udp/[::]:7447",
    ]
    BACKEND_CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://localhost:8080",
        "http://172.20.0.10:3000",
        "http://172.20.0.11:3001",
    ]
    MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://mongodb:27017")
    DEMO_MODE = os.environ.get("DEMO_MODE", "true") == "true"

    SPEED_TOPIC = os.getenv("SPEED_TOPIC", "cloud/telemetry/speed")
    EXTERIOR_TOPIC = os.getenv("EXTERIOR_TOPIC", "cloud/telemetry/exterior")
    LOCATION_TOPIC = os.getenv("LOCATION_TOPIC", "cloud/telemetry/location")
    TIRES_TOPIC = os.getenv("TIRES_TOPIC", "cloud/telemetry/tires")
    SYSTEM_STATE_TOPIC = os.getenv("SYSTEM_STATE_TOPIC", "cloud/telemetry/system_state")
    TRIP_DATA_TOPIC = os.getenv("TRIP_DATA_TOPIC", "cloud/telemetry/trip_data")
    BATTERY_EVENT_TOPIC = os.getenv(
        "BATTERY_EVENT_TOPIC", "cloud/telemetry/battery_event"
    )
