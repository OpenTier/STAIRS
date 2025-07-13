# Device Gateway
## Description
This service is responsible for communication between devices and STAIRS. Currently provided features:
1. Keeping track of active vehicles (inside a DB).
2. Communication with the vehicles and data ingestion of telemtry data into a time-series DB.
3. Managing the Digital Twin on the backend, synchronizing data between the physical vehicle and its virtual counterpart.
4. Providing internal REST APIs to STAIRS API layer to manage user commands or queries.
## Handling Different Devices
The service is designed to be a generic device gateway to handle different device types. It currently supports handling [vehicles](https://github.com/OpenTier/vehicle-demo) as a main use-case.
## Device-Cloud Messages
* See [vehicle-cloud-api](../../../api/vehicle-cloud-api/) as an example of vehicle communication with the device gateway.
* See [How To](../../../doc/how-to.md) guide for data updates
## Communication Protocols
* For efficient and scalable data distribution, we utilized **Zenoh**, an open-source protocol that unifies data in motion, data at rest, and computations, providing low-latency and high-throughput communication between device and cloud.
* We plan to extend it to support other communication protocols (e.g. MQTT).
