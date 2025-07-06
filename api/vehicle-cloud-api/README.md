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