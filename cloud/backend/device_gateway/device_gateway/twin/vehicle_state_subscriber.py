import zenoh
import logging
from device_gateway.generated.vehicle_cloud_events_pb2 import (
    SpeedEvent,
    ExteriorEvent,
    CurrentLocationEvent,
    SystemStateEvent,
    TirePressureEvent,
    TripDataEvent,
    BatteryEvent,
)
from device_gateway.db.vehicle_repository import VehicleRepository
from device_gateway.db.influx_writer import InfluxWriter
from device_gateway.configuration import Configuration


class VehicleStateSubscriber:

    def __init__(
        self,
        session: zenoh.Session,
        repository: VehicleRepository,
        db_writer: InfluxWriter,
    ) -> None:
        self._logger = logging.getLogger(__name__)
        self._repository = repository
        self._db_writer = db_writer

        # Subscribe to the topics
        self._subscribe(
            session, Configuration.BATTERY_EVENT_TOPIC, self.on_battery_data
        )
        self._subscribe(session, Configuration.TRIP_DATA_TOPIC, self.on_trip_data)
        self._subscribe(session, Configuration.SPEED_TOPIC, self.on_speed_data)
        self._subscribe(session, Configuration.EXTERIOR_TOPIC, self.on_exterior_data)
        self._subscribe(session, Configuration.TIRES_TOPIC, self.on_tires_data)
        self._subscribe(
            session,
            Configuration.SYSTEM_STATE_TOPIC,
            self.on_lock_state_data,
        )
        self._subscribe(session, Configuration.LOCATION_TOPIC, self.on_location_data)

    def on_battery_data(self, sample: zenoh.Sample):
        data = BatteryEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_battery_data] New message received")
            vehicle_state.update_battery_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_battery_data(data, vehicle_state.entity_id)
        else:
            self._logger.warning(
                "[on_battery_data] Vehicle with id %s tries to publish "
                "while not provisioned",
                data.vehicle_id,
            )

    def on_location_data(self, sample: zenoh.Sample):
        data = CurrentLocationEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_location_data] New message received")
            vehicle_state.update_location_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_location_data(data, vehicle_state.entity_id)
        else:
            self._logger.warning(
                "[on_location_data] Vehicle with id %s "
                "tries to publish while not provisioned",
                data.vehicle_id,
            )

    def on_speed_data(self, sample: zenoh.Sample):
        data = SpeedEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_speed_data] New message received")
            vehicle_state.update_speed_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_speed_data(data, vehicle_state.entity_id)
        else:
            self._logger.warning(
                "[on_speed_data] Vehicle with id %s tries "
                "to publish while not provisioned",
                data.vehicle_id,
            )

    def on_exterior_data(self, sample: zenoh.Sample):
        data = ExteriorEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_exterior_data] New message received")
            vehicle_state.update_exterior_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_exterior_data(data, vehicle_state.entity_id)
        else:
            self._logger.warning(
                "[on_exterior_data] Vehicle with id %s tries "
                "to publish while not provisioned",
                data.vehicle_id,
            )

    def on_trip_data(self, sample: zenoh.Sample):
        data = TripDataEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_trip_data] New message received")
            vehicle_state.update_trip_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_trip_data(data, vehicle_state.entity_id)
        else:
            self._logger.warning(
                "[on_trip_data] Vehicle with id %s tries "
                "to publish while not provisioned",
                data.vehicle_id,
            )

    def on_lock_state_data(self, sample: zenoh.Sample):
        data = SystemStateEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_lock_state_data] New message received")
            vehicle_state.update_lock_state_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_lock_state_data(data, vehicle_state.entity_id)

            if data.system_state == "off":
                self._logger.debug(
                    "Vehicle %s is off. Propagating " "the data.", data.vehicle_id
                )
        else:
            self._logger.warning(
                "[on_lock_state_data] Vehicle with id %s tries "
                "to publish while not provisioned",
                data.vehicle_id,
            )

    def on_tires_data(self, sample: zenoh.Sample):
        data = TirePressureEvent.FromString(sample.payload.__bytes__())
        vehicle_state = self._repository.find_vehicle_by_vehicle_id(data.vehicle_id)
        if vehicle_state is not None:
            self._logger.debug("[on_tires_data] New message received")
            vehicle_state.update_tires_data(data)
            self._repository.add_vehicle(vehicle_state)  # Update the database
            self._db_writer.write_tires_data(data, vehicle_state.entity_id)
        else:
            self._logger.warning(
                "[on_tires_data] Vehicle with id %s tries "
                "to publish while not provisioned",
                data.vehicle_id,
            )

    def _subscribe(
        self, session: zenoh.Session, key_expr: str, handler: callable
    ) -> None:
        session.declare_subscriber(key_expr=key_expr, handler=handler)
