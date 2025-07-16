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

# (How To) Guide
This is a guide on how to use or extend STAIRS

## Integrate your application using REST APIs
1. Start STAIRS as described in the [README](../README.md).
2. Go to [http://localhost:3001/docs](http://localhost:3001/docs) to see the REST APIs documentation and live demo.
3. Update your application interact with STAIRS APIs.

Note: see (Security) section in [API README](../cloud/backend/stairs_api/README.md) for authentication.

## Update the device-cloud messages
1. Update the data in [api](../api/). This is directly reflected in the `device` and the `device_gateway`:
    - vehicle_cloud_events.proto
    - vehicle_commands.proto
2. Update the following accordingly in `device`:
    - [device proto](../devices/vehicle-demo/proto/)
    - [topics](../devices/vehicle-demo/vehicle/common/src/topics.rs)
    - [signal mocker](../devices/vehicle-demo/vehicle/signal_mocker_service/)
    - [twin service](../devices/vehicle-demo/vehicle/twin_service/)
    - [vehicle messages](../devices/vehicle-demo/vehicle/vehicle_msgs/)
    - Attach the updated api
3. Update the following accordingly in `device_gateway`:
    - [zenoh-topics](../docker-compose.yaml)
    - [topics configuration](../cloud/backend/device_gateway/device_gateway/configuration.py)
    - [digital twin service](../cloud/backend/device_gateway/device_gateway/twin)
    - [influx writer](../cloud/backend/device_gateway/device_gateway/db/influx_writer.py)
    - [endpoint](../cloud/backend/device_gateway/device_gateway/api/vehicles.py)
4. Update the following accordingly in `stairs_api`:
    - [commands endpoints](../cloud/backend/stairs_api/src/commands/)
    - [telemetry data endpoint](../cloud/backend/stairs_api/src/telemetry/)
5. Update the following accordingly in `observability stack`:
    - [Grafana dashboards and alerts](../monitoring/grafana/provisioning/)

## Try with a real device
1. Compile the `device` code to run on the target chip (a script is provided for RPi)
2. Comment out the `device` section in the [docker compose](../docker-compose.yaml)
3. Connect the device to the same network as the host