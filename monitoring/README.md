# Monitoring Stack Setup

This directory contains the complete monitoring setup for the platform, providing comprehensive visualization and alerting for device monitoring, infrastructure monitoring, and system logs.

## Overview

Grafana is configured as the primary visualization and alerting platform, integrating with multiple data sources to provide real-time insights into device telemetry, system performance, and operational status.

### Data Sources

1. **InfluxDB** (Primary)

   - Type: Time-series database
   - Purpose: Device telemetry data storage
   - Configuration: Flux query language enabled
   - Default bucket for telemetry data

2. **Prometheus**

   - Type: Metrics collection
   - Purpose: Infrastructure and application metrics

3. **Loki**
   - Type: Log aggregation
   - Purpose: Centralized logging for all services

4. **Tempo**
   - Type: Traces aggregation
   - Purpose: Centralized tracing for all services

### Architecture
![Observability Stack Architecture](<STAIRS-Observability Stack.drawio.png>)

### Configuration
See `.ini` files

## Dashboards

1. Device Dashboard - default : Individual device monitoring
2. Node Exporter Full: Comprehensive infrastructure monitoring
3. Device Location Map Dashboard: Geographic tracking for all the devices
4. Logs Dashboard: Centralized log viewing

### Alerting System

* The platform implements an alerting system in the "battery-status" alert group with 10-second evaluation intervals.
* See `provisioning/alerting/alert.json` for more details.

## Drilldowns

1. Logs: Access logs and filter them (by text or severity)
2. Traces: Analyze traces and spans for time durations of each operation
