# Copyright (c) 2025 by OpenTier GmbH
# SPDX-FileCopyrightText: 2025 OpenTier GmbH
# SPDX-License-Identifier: LGPL-3.0-or-later

# This file is part of OpenTier.

# This is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.

# This is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.

# You should have received a copy of the GNU Lesser General Public
# License along with this file.  If not, see <https://www.gnu.org/licenses/>.

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
