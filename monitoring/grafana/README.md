# Grafana Monitoring Setup

This directory contains the complete Grafana monitoring setup for the Open Tier Platform, providing comprehensive visualization and alerting for vehicle fleet management, infrastructure monitoring, and system logs.

## Overview

Grafana is configured as the primary visualization and alerting platform, integrating with multiple data sources to provide real-time insights into vehicle telemetry, system performance, and operational status.

## Configuration

### Main Configuration (`grafana.ini`)

- **Provisioning Path**: Automatically loads dashboards, datasources, and alerts from the `provisioning/` directory
- **Default Dashboard**: Infrastructure monitoring dashboard loads by default
- **Authentication**: Anonymous access enabled with Admin role for development
- **Security**: Embedding allowed for integration with other platforms

### Data Sources (`provisioning/datasources/all.yml`)

The platform integrates with three primary data sources:

1. **InfluxDB** (Primary)

   - Type: Time-series database
   - Purpose: Vehicle telemetry data storage
   - Configuration: Flux query language enabled
   - Default bucket for telemetry data

2. **Prometheus**

   - Type: Metrics collection
   - Purpose: Infrastructure and application metrics
   - Endpoint: `http://prometheus:9090`

3. **Loki**
   - Type: Log aggregation
   - Purpose: Centralized logging for all services
   - Endpoint: `http://loki:3100`

## Dashboard Organization

Dashboards are organized into two main folders:

### Services Folder

Contains infrastructure and system monitoring dashboards:

#### 1. Node Exporter Full (`infrastructure-data-dashboard.json`)

**Purpose**: Comprehensive infrastructure monitoring
**Key Panels**:

- **System Overview**: Quick CPU/Memory/Disk status
- **Resource Monitoring**:
  - CPU usage and load averages
  - Memory (RAM/SWAP) utilization
  - Disk space and I/O statistics
  - Network traffic
- **System Information**:
  - CPU core count
  - Total system resources
  - System uptime
  - Reboot requirements
- **Detailed Metrics**: Advanced CPU, memory, network, and disk analytics

#### 2. Telemetry Data Dashboard (`telemetry-data-dashboard.json`)

**Purpose**: Vehicle speed monitoring and telemetry visualization
**Key Panels**:

- **Vehicle Speed**: Real-time speed tracking with threshold alerts
- Time-series visualization with 5-second aggregation windows
- Speed limits visualization (100 km/h threshold)

#### 3. Logs Dashboard (`logs-dashboard.json`)

**Purpose**: Centralized log viewing and analysis
**Key Panels**:

- **Logs Panel**: Real-time log streaming from all services
- Integration with Loki for log aggregation

#### 4. Vehicle Location Map Dashboard (`vehicle-location-map-dashboard.json`)

**Purpose**: Geographic tracking and fleet visualization
**Key Panels**:

- **Vehicles Map**: Real-time vehicle positioning
- **Vehicle Coordinates Table**: Detailed location data in tabular format
- Geographic visualization for fleet management

### Vehicles Folder

Contains vehicle-specific monitoring dashboards:

#### Vehicle Dashboard (`vehicles/vehicle-dashboard.json`)

**Purpose**: Individual vehicle monitoring and diagnostics
**Key Panels**:

- **Connectivity Status**: Vehicle communication health
- **Battery Monitoring**:
  - Battery level percentage
  - Battery temperature monitoring
- **Location Tracking**: Individual vehicle map with real-time positioning
- **Performance Metrics**:
  - Speed monitoring (km/h)
  - Engine temperature tracking
- **Safety Monitoring**:
  - Tire pressure sensors
  - Critical system alerts

## Alerting System (`provisioning/alerting/alert.json`)

The platform implements a comprehensive alerting system in the "battery-status" alert group with 10-second evaluation intervals:

### Critical Alerts

#### 1. Critical Battery Danger

- **Trigger**: Battery level ≤ 10%
- **Duration**: 10 seconds
- **Purpose**: Immediate notification for critical battery levels requiring urgent attention

#### 2. Vehicle Speed DANGER

- **Trigger**: Speed > 100 km/h
- **Duration**: 15 seconds
- **Purpose**: Safety alert for excessive vehicle speeds

#### 3. Engine Temperature DANGER

- **Trigger**: Temperature > 150°C
- **Duration**: 15 seconds
- **Purpose**: Critical engine overheating protection

### Warning Alerts

#### 4. Engine Temperature Warning

- **Trigger**: Temperature > 130°C
- **Duration**: 30 seconds
- **Purpose**: Early warning for engine temperature concerns

### Alert Configuration

- **Data Source**: InfluxDB telemetry bucket
- **Query Window**: 30-second lookback for data collection
- **Notification**: Email alerts via Grafana default email receiver (SMTP configuration required)
- **Dashboard Integration**: Links to specific dashboard panels for context

## Data Flow Architecture

```
Vehicle Telemetry → InfluxDB → Grafana Dashboards
System Metrics → Prometheus → Infrastructure Dashboard
Application Logs → Loki → Logs Dashboard
```

## Usage Instructions

### Accessing Dashboards

1. **Default View**: Infrastructure monitoring loads automatically
2. **Services Folder**: System and infrastructure monitoring
3. **Vehicles Folder**: Vehicle-specific dashboards and fleet management

### Setting Up Alerts

- Alerts are pre-configured and automatically loaded
- Email notifications require SMTP configuration in Grafana settings
- Alert thresholds can be modified in the `alert.json` file

### Dashboard Customization

- All dashboards support real-time editing
- Changes made in the UI can be exported and saved to JSON files
- Provisioned dashboards reload automatically on container restart

### Time Ranges

- Default: Last 24 hours
- Configurable per dashboard
- Real-time data updates for vehicle monitoring

## Integration Points

### Vehicle Telemetry

- Battery level and temperature monitoring
- Speed and location tracking
- Engine diagnostics
- Tire pressure monitoring

### Infrastructure Monitoring

- Server resource utilization
- Network performance
- System health and uptime
- Service availability

### Fleet Management

- Multi-vehicle oversight
- Geographic fleet distribution
- Performance analytics across vehicles
- Predictive maintenance insights

## Reference Links

- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [Grafana Panels and Visualizations](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/)
- [InfluxDB Flux Query Language](https://docs.influxdata.com/flux/)
- [Prometheus Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)
