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

# Device Gateway
## Description
This service is responsible for communication between devices and STAIRS. Currently provided features:
1. Keeping track of active vehicles (inside a DB).
2. Communication with the vehicles and data ingestion of telemtry data into a time-series DB.
3. Providing internal REST APIs to STAIRS API layer to manage user commands or queries.
## Handling Different Devices
The service is designed to be a generic device gateway to handle different device types. It currently supports handling [vehicles](https://github.com/OpenTier/vehicle-demo) as a main use-case.
## Device-Cloud Messages
* See [vehicle-cloud-api](../../../api/vehicle-cloud-api/) as an example of vehicle communication with the device gateway.
* See [How To](../../../doc/how-to.md) guide for data updates
## Communication Protocols
* For efficient and scalable data distribution, we utilized **Zenoh**, an open-source protocol that unifies data in motion, data at rest, and computations, providing low-latency and high-throughput communication between device and cloud.
* We plan to extend it to support other communication protocols (e.g. MQTT).
