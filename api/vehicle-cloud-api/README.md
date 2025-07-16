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

# Vehicle-Cloud API

This project contains the Vehicle Signal Specification (VSS) for a scooter and the associated vehicle commands. The VSS defines a comprehensive set of signals for various vehicle components, while the vehicle commands define the protocol for controlling these components.

## Project Structure

```
proto/
    vehicle_cloud_events.proto
    vehicle_commands.proto
    vehicle_msgs.proto
README.md
vss/
    quantities.yaml
    units.yaml
    vss_scooter_signals.yaml
```

### Directories and Files

- **proto/**: Contains Protocol Buffers (proto) definitions for vehicle commands and events.
  - **vehicle_cloud_events.proto**: Defines events related to vehicle cloud interactions.
  - **vehicle_commands.proto**: Defines commands for controlling vehicle components.
  - **vehicle_msgs.proto**: Defines messages for various vehicle signals and states.
- **vss/**: Contains YAML files defining the Vehicle Signal Specification (VSS).
  - **quantities.yaml**: Defines various quantities used in the VSS.
  - **units.yaml**: Defines units of measurement used in the VSS.
  - **vss_scooter_signals.yaml**: Defines the signals for the scooter, including sensors, actuators, and attributes.

## Getting Started

### Prerequisites

- Protocol Buffers compiler (protoc)

### Compiling Protocol Buffers

To compile the Protocol Buffers definitions for Python, run:

```bash
protoc --proto_path=proto --python_out=generated proto/*.proto
```

Check `protoc` help for other langauges support.

## Usage

- **Vehicle Commands**: Use the messages defined in `vehicle_commands.proto` to send commands to the vehicle.
- **Vehicle Signals**: Refer to `vss_scooter_signals.yaml` for the list of available signals and their descriptions.