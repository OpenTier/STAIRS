# STAIRS Platform Architecture (v0.1.0)

This document outlines the architecture and main components of the STAIRS platform.


## Architecture Diagram

![STAIRS Overall Architecture](<STAIRS-Overall Architecture.drawio.png>)

## Components and Services

### Device
* The embedded / IoT device(s) that are being monitored by the platform (i.e. can send / receive data to / from the platform).
* This is *outside* the platform's scope.
* For demonstration purposes, we are using a [vehicle-demo](../devices/).

### Device-Cloud Communication
* The messaging layer between devices and cloud.
* This is also *outside* the platform's scope, but will affect the code of some of its services.
* For demonstration purposes, we are using a [vehicle-cloud-api](../api/)

### Device-Cloud Router
* The service that routes the communication between the `Device Gateway` and the `Device`.
* We are using a [Zenoh router](../docker/backend/cloud_router/)

### Device Gateway
* Handles:
    - Communication with IoT devices using various protocols, ensuring secure and reliable connections. Responsible for protocol translation, device authentication, and message routing.
    - Data ingestion in the `Telemetry DB`.
* We developed this [Device Gateway](../cloud/backend/device_gateway) service.

### Telemetry DB
* Stores the measurements / metrics / data send by the devices authenticated and monitored by the `Device Gateway`.
* This is a 3rd party Time-series DB.
* We used an [Influx DB](../docker-compose.yaml) docker image.

### Device DB
* Stores:
    - The static data that the STAIRS user will use to identify the device (e.g. code, name ...)
    - The monitoring status of the device (activated or deactivated)
* We used a [PostgreSQL DB](../docker-compose.yaml) docker image for device identifcation (managed by `API Gateway` service), and [Mongo DB](../docker-compose.yaml) docker image for device status (managed by `Device Gateway` service).

### API Gateway
* Provides a unified entry point (with REST APIs) for all client or 3rd-party applications, handling authentication, rate limiting, and request routing. Manages access control and serves as the interface for external systems.
* We developed this [STAIRS API](../cloud/backend/stairs_api/README.md) service.

### Observability Stack
* Provides insights to the device data and system metircs / logs / traces.
* This is optional in a separate docker compose: [docker-compose-observability.yaml](../docker-compose.observability.yaml).
* See the [README](../README.md) file for more details.

## Technology Stack

The STAIRS platform is designed to be technology-agnostic, allowing for flexibility in implementation. However, the reference architecture leverages proven open source technologies for each component.

## Deployment

STAIRS currently supports containerized deployment for easy scaling and management.