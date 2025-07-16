#!/bin/bash
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