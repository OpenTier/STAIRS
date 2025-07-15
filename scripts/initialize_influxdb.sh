#!/bin/bash
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

INFLUX_USER="${INFLUX_USER:-admin}"
INFLUX_PASSWORD="${INFLUX_PASSWORD:-secretpassword}"
INFLUX_TOKEN="${INFLUX_TOKEN:-my-secret-token}"
INFLUX_ORG="${INFLUX_ORG:-OpenTier}"
INFLUX_BUCKET="${INFLUX_BUCKET:-telemetry}"

# Ensure InfluxDB is running by attempting to ping
if ! influx ping > /dev/null 2>&1; then
    echo "Error: Unable to reach InfluxDB. Please ensure InfluxDB is running."
    exit 1
fi

# Call influx setup and print initialization message
if influx setup -u "$INFLUX_USER" -p "$INFLUX_PASSWORD" -t "$INFLUX_TOKEN" -o "$INFLUX_ORG" -b "$INFLUX_BUCKET" -f; then
    echo "InfluxDB has been initialized successfully."
else
    echo "Error: InfluxDB setup failed."
    exit 1
fi