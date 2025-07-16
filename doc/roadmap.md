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

# STAIRS Development Roadmap

This document outlines the planned features and current development status for the STAIRS platform (Scalable Technology for Automotive, IoT and Robotics Systems).

## Features

### 🚀 Current (In Progress)

| Feature                                      | Description                                                                                                                                                                                                                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Device Management                            | Provides tools for remote monitoring, configuration, and control over devices. This includes status monitoring, diagnostic alerts, and remote configuration updates to maintain optimal device performance and reduce downtime.                                                  |
| API Integration & Interoperability           | Provides extensive APIs and SDKs that enable integration with third-party systems, legacy applications, and other IoT ecosystems. This promotes connectivity among various platforms and simplifies the extension of functionalities.                                            |
| Customizable Rules Engine                    | Includes a flexible rules engine that allows users to define custom business logic, triggers, and automated workflows in response to specific sensor events or thresholds, supporting both scheduled maintenance in static setups and dynamic responses in devices.             |


### 🛠 Next (Planned)

| Feature                                      | Description                                                                                                                                                                                                                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Connectivity Protocol Support                | Supports multiple communication protocols (e.g., MQTT, CoAP, HTTP, AMQP) to ensure interoperability between a wide range of devices and networks, whether they are static sensors in a building or connected vehicles on the move.                                               |
| Data Analytics & Visualization               | Incorporates analytics tools and dashboard capabilities that aggregate device data, create visualizations, and derive actionable insights in real-time. This helps stakeholders monitor performance trends and predict maintenance needs.                                        |
| Integration with AI & Machine Learning       | Leverages AI/ML techniques for predictive analytics, anomaly detection, and optimizing operational efficiency. This integration supports advanced use cases like predictive maintenance for equipment or intelligent driving aids in vehicles.                                   |

###  🌱 Future (Long‑Term Ideas)

| Feature                                      | Description                                                                                                                                                                                                                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Real-Time Data Ingestion & Stream Processing | Facilitates the collection and continuous processing of high-frequency sensor data streams. This capability ensures timely insights from both fixed installations and dynamic sources like vehicles, enabling immediate response to critical events or anomalies.                |
| Edge Computing                               | Empowers localized data processing directly at the edge of the network (e.g., in vehicles or remote sensors) to reduce latency, conserve bandwidth, and deliver faster insights where necessary.                                                                                 |
| Scalability & Performance                    | Ensures that the platform can handle an increasing number of devices and volume of data, with load balancing, multi-tenant support, and high availability features to meet the diverse needs of large static deployments and widespread device fleets.                          |
| Data Privacy & Regulatory Compliance         | Ensures that data collection, storage, and processing adhere to relevant privacy laws and industry regulations (e.g., GDPR, HIPAA), protecting sensitive information from both stationary and mobile environments.                                                               |
| Security & Encryption                        | Offers comprehensive security measures, including authentication, access control, data encryption in transit and at rest, and regular vulnerability assessments to safeguard both the devices and transmitted data.                                                              |
| Logging & Audit Trails                       | Maintains detailed logs of device events, system changes, and user actions to support compliance, security audits, and debugging, ensuring that every interaction on the platform can be traced back if necessary.                                                               |
| Remote Firmware & Software Updates           | Allows for Over-the-Air (OTA) updates and remote patching of device software. This is essential for maintaining security, adding new features, and correcting issues without requiring physical access to the devices.                                                           |
| Event-Driven Architecture                    | Structures the platform to react to events generated by devices as they occur, enabling efficient real-time processing and integration with automation workflows, which is particularly beneficial for critical alerts in safety systems.                                     |
| Device Registration & Provisioning           | Enables the seamless onboarding of devices into the platform by automating the registration process, assigning unique identities, and initializing secure configurations. This is crucial for both fixed installations and mobile/vehicle-based devices.                         |
| Device Lifecycle Management                  | Manages the full lifecycle of IoT devices—from deployment and operation through to retirement—by tracking device status, usage patterns, and maintenance requirements, which is particularly critical for long-lasting static devices and rapidly evolving device technologies. |

## Note

The roadmap is subject to change based on community feedback and project priorities. If you're interested in contributing to any of these features, please check our [contribution guidelines](../CONTRIBUTING.md) and join the discussion in the issues section.
