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