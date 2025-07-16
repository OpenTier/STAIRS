# Build Tools

This document describes helper scripts found in the `scripts/` directory and the
tools required to run them.

## Scripts

- **generate_api.sh** – wrapper around the OpenAPI Generator. Use it to generate
  client or server code from OpenAPI specs. Requires `@openapitools/openapi-generator-cli`.
- **generate_async_api.sh** – generates code from AsyncAPI definitions.
  Requires the `asyncapi` CLI.
- **generate_protobuf_from_vss.sh** – converts VSS YAML definitions to
  `vehicle_msgs.proto` using `vspec2protobuf.py`.
- **initialize_influxdb.sh** – initializes buckets and tokens in a running InfluxDB instance.
- **demo/** scripts – helper scripts to load demo data and restart containers.
- **deploy/** scripts – utilities for deploying to a Raspberry Pi.

Ensure Node.js and Python are installed when running these scripts locally.
