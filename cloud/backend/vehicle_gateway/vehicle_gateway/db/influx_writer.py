from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from vehicle_gateway.configuration import Configuration


class InfluxWriter:

    def __init__(self, org: str, token: str, url: str, bucket: str) -> None:
        self._influx_client = InfluxDBClient(url=url, token=token, org=org)
        self._write_api = self._influx_client.write_api(write_options=SYNCHRONOUS)
        self._bucket = bucket

    def _do_write(self, point: Point):
        try:
            self._write_api.write(bucket=self._bucket, record=point)
        except Exception as e:
            print(f"Error writing to InfluxDB: {e}")

    def write_battery_data(self, data, entity_id: int):
        point = (
            Point("battery")
            .tag("device_id", entity_id)
            .field("battery_level", data.battery_level)
            .field("is_charging", (1 if data.is_charging else 0))
            .field("is_discharging", (1 if data.is_discharging else 0))
            .field("time_to_fully_charge", data.time_to_fully_charge)
            .field("estimated_range", data.estimated_range)
            .field("state_of_health", data.state_of_health)
            .field("temperature", data.temperature)
        )

        self._do_write(point)

    def write_location_data(self, data, entity_id: int):
        if Configuration.SKIP_LOCATION_WRITING is False:
            point = (
                Point("location")
                .tag("device_id", entity_id)
                .field("altitude", data.altitude)
                .field("latitude", data.latitude)
                .field("longitude", data.longitude)
                .field("timestamp", data.timestamp)
            )

            self._do_write(point)

    def write_speed_data(self, data, entity_id: int):
        point = Point("speed").tag("device_id", entity_id).field("speed", data.speed)

        self._do_write(point)

    def write_exterior_data(self, data, entity_id: int):
        point = (
            Point("exterior")
            .tag("device_id", entity_id)
            .field("air_temperature", data.air_temperature)
            .field("humidity", data.humidity)
            .field("light_intensity", data.light_intensity)
        )

        self._do_write(point)

    def write_trip_data(self, data, entity_id: int):
        point = (
            Point("trip")
            .tag("device_id", entity_id)
            .field("start_time", data.start_time)
            .field("traveled_distance", data.traveled_distance)
            .field("traveled_distance_since_start", data.traveled_distance_since_start)
            .field("trip_duration", data.trip_duration)
            .field("trip_meter_reading", data.trip_meter_reading)
            .field("average_speed", data.average_speed)
        )

        self._do_write(point)

    def write_lock_state_data(self, data, entity_id: int):
        point = (
            Point("lock_state")
            .tag("device_id", entity_id)
            .field("system_state", data.system_state)
        )

        self._do_write(point)

    def write_tires_data(self, data, entity_id: int):
        point = (
            Point("tires")
            # TODO: missing other data
            .tag("device_id", entity_id)
            .field("front_tire_pressure", data.front_tire.pressure)
            .field("rear_tire_pressure", data.rear_tire.pressure)
        )

        self._do_write(point)
