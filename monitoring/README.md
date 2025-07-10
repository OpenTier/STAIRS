# Monitoring Stack Setup

This directory contains the complete monitoring setup for the platform, providing comprehensive visualization and alerting for device monitoring, infrastructure monitoring, and system logs.

## Overview

Grafana is configured as the primary visualization and alerting platform, integrating with multiple data sources to provide real-time insights into device telemetry, system performance, and operational status.

### Data Sources

1. **InfluxDB**

   - Type: Time-series database
   - Purpose: Device telemetry data storage

2. **Prometheus**

   - Type: Time-series database
   - Purpose: Infrastructure and application metrics collection

3. **Loki**
   - Type: Log aggregation database
   - Purpose: Centralized logging for all services

4. **Tempo**
   - Type: Traces aggregation database
   - Purpose: Centralized tracing for all services

### Architecture
![Observability Stack Architecture](<STAIRS-Observability Stack.drawio.png>)

### Configuration
See `.ini` - `.yml` - `.yaml` files per individual service

## Output

1. Dashboards -> Device Dashboard - default : Individual device monitoring
2. Drilldown -> Logs: Access logs and filter them (by text or severity)
2. Drilldown -> Traces: Analyze traces and spans for time durations of each operation
4. Dashboards -> Node Exporter Full: Comprehensive infrastructure monitoring

### Alerting System

* The platform implements a demo alerting system. See `provisioning/alerting/alert.json` for more details.
