# STAIRS

**S**calable **T**echnology for **A**utomotive, **I**oT and **R**obotics **S**ystems

> \- I have a complex network of IoT devices and vehicles that need cloud connectivity.
>
> \+ Have you tried using STAIRS?


## Project Overview

* **STAIRS** is an open source cloud platform that leverages open source components to provide a comprehensive solution for automotive, IoT, and robotics systems.
* It is designed to support a wide range of devices and use cases from fixed installations to mobile/vehicle-based devices.

### 🔑 Available Features
- Flexible communication between device and cloud using protobuf API
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
* Go to [http://localhost:3001/docs](http://localhost:3001/docs) to see the REST APIs documentation and live demo

## 📖 Documentation
- [Architecture](doc/architecture.md)
- [(How To) Guides](./doc/how-to.md)
- Configurations and Environment Variables: See [docker-compse](docker-compose.yaml) and [docker-compose-observability](docker-compose.observability.yaml)
- [Roadmap](doc/roadmap.md)
- [Contribution guidelines](CONTRIBUTING.md)
- [License file](LICENSE.md)
