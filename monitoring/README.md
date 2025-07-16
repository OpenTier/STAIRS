<!--
Copyright (c) 2025 by OpenTier GmbH
SPDX‑FileCopyrightText: 2025 OpenTier GmbH
SPDX‑License‑Identifier: MIT

This file is part of OpenTier.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

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
