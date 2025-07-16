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

# STAIRS

**S**calable **T**echnology for **A**utomotive, **I**oT and **R**obotics **S**ystems

> \- I have a complex network of IoT devices and vehicles that need cloud connectivity.
>
> \+ Have you tried using STAIRS?


## Project Overview

* **STAIRS** is an open source cloud platform that leverages open source components to provide a comprehensive solution for automotive, IoT, and robotics systems.
* It is designed to support a wide range of devices and use cases from fixed installations to mobile/vehicle-based devices.

### 🔑 Available Features
- Flexible communication between device and cloud using protobuf
- Real‑time dashboard to visualize device data
- REST APIs for 3rd party integration or building custom UI
- Logs and traces for the internal services of the platform
- …and more!

## Getting Started

### ⚙️ Prerequisites
- Docker (tested with 27.1.1)
- Docker Compose (tested with v2.29.1-desktop.1)

### 📃 Instructions

1. Clone the Repository

```sh
git clone https://github.com/OpenTier/STAIRS.git
cd STAIRS
```

2. Initialize and update the git submodules:
```sh
git submodule update --init --recursive
```

3. Compose the platform:
- Option 1 (recommended): with [observability stack](./monitoring/README.md) and [REST APIs](./cloud/backend/stairs_api/README.md) integration:
```sh
docker compose -f docker-compose.yaml -f docker-compose.observability.yaml up -d
```
- Option 2 (if you just want to integrate with STAIRS by REST APIs): with [REST APIs](./cloud/backend/stairs_api/README.md) integration only:
```sh
docker compose up -d
```

### 🏃 Quickstart
Once the platform is up:
* Go to [http://localhost:5000](http://localhost:5000) to see the dashboard (option 1)
* Go to [http://localhost:3001/docs](http://localhost:3001/docs) to see the REST APIs documentation and interact with them

## 📖 Documentation
- [Architecture](doc/architecture.md)
- [(How To) Guides](./doc/how-to.md)
- [Roadmap](doc/roadmap.md)
- [Contribution guidelines](CONTRIBUTING.md)
- [License file](LICENSE.md)

## ⚠️ Security Disclaimer
Note: For simplicity and ease of setup, database credentials and other secrets are stored directly in the `docker-compose.yml` file.

In a production environment, this is not a secure practice.
Secrets such as database credentials, API keys, and access tokens should be managed using secure methods like:
- Environment variables managed outside version control
- Docker secrets
- Secret management tools (e.g., HashiCorp Vault, AWS Secrets Manager, etc.)

Always follow security best practices when deploying to staging or production environments.

