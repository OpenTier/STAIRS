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