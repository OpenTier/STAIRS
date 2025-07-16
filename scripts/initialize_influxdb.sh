#!/bin/bash

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