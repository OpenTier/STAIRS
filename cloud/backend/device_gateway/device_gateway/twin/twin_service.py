from device_gateway.twin.vehicle_state import VehicleState
from device_gateway.twin.vehicle_state_subscriber import VehicleStateSubscriber
from device_gateway.twin.vehicle_command_publisher import (
    VehicleCommandPublisher,
    LockState,
    CommandState,
    CommandTarget,
)
import zenoh
import logging
import json
from device_gateway.configuration import Configuration
from device_gateway.db.influx_writer import InfluxWriter
from device_gateway.db.vehicle_repository import VehicleRepository


class TwinService:

    def __init__(self) -> None:
        self._logger = logging.getLogger(__name__)
        self._vehicle_repository: VehicleRepository = None
        self._command_publisher: VehicleCommandPublisher = None
        self._vehicle_subscriber: VehicleStateSubscriber = None

    async def start(self):
        self._logger.info("Starting TwinService...")
        zenoh.try_init_log_from_env()
        self._config = zenoh.Config()
        self._config.insert_json5(
            "connect/endpoints", json.dumps(Configuration.ZENOH_CLOUD_ENTRYPOINTS)
        )
        self._session = zenoh.open(self._config)

        self._influx_writer = InfluxWriter(
            Configuration.INFLUXDB_ORG,
            Configuration.INFLUXDB_TOKEN,
            Configuration.INFLUXDB_HOST,
            Configuration.INFLUXDB_BUCKET,
        )
        self._vehicle_repository = VehicleRepository(Configuration.MONGODB_URI)

        # Initialize subscribers
        self._vehicle_subscriber = VehicleStateSubscriber(
            self._session, self._vehicle_repository, self._influx_writer
        )

        # Initialize publishers
        self._command_publisher = VehicleCommandPublisher(self._session)

        self._logger.info("Initializing vehicle connections...")

        ids = await self._vehicle_repository.list_all_vehicle_ids_async()
        for vehicle_id in ids:
            self._logger.info(f"Creating publishers for vehicle: {vehicle_id}")
            self._command_publisher.create_lock_publisher(self._session, vehicle_id)
            self._command_publisher.create_turn_on_off_publisher(
                self._session, vehicle_id
            )

        self._logger.info("TwinService started successfully")

    def stop(self):
        self._logger.info("Stopping TwinService...")
        if hasattr(self, "_session") and self._session is not None:
            self._logger.info("Closing Zenoh session...")
            self._session.close()

        if self._vehicle_repository:
            self._vehicle_repository.close()

    async def lock_unlock_vehicle(self, entity_id: int, lock: bool) -> bool:
        self._logger.info(f"Lock/Unlock vehicle: {entity_id}, lock: {lock}")
        vehicle_state = await self._vehicle_repository.find_vehicle_by_entity_id_async(
            entity_id
        )
        if not vehicle_state:
            self._logger.info("Vehicle not found")
            return False

        lock_state = LockState.LOCK if lock else LockState.UNLOCK
        self._command_publisher.publish_lock_unlock_command(
            vehicle_state.vehicle_id, lock_state
        )
        return True

    async def horn_turn_on_off(self, entity_id: int, on: bool) -> bool:
        vehicle_state = await self._vehicle_repository.find_vehicle_by_entity_id_async(
            entity_id
        )
        if not vehicle_state:
            return False

        command_state = CommandState.ON if on else CommandState.OFF
        self._command_publisher.publish_turn_on_off_command(
            vehicle_state.vehicle_id, CommandTarget.HORN, command_state
        )
        return True

    async def lights_turn_on_off(self, entity_id: int, on: bool) -> bool:
        vehicle_state = await self._vehicle_repository.find_vehicle_by_entity_id_async(
            entity_id
        )
        if not vehicle_state:
            return False

        command_state = CommandState.ON if on else CommandState.OFF
        self._command_publisher.publish_turn_on_off_command(
            vehicle_state.vehicle_id, CommandTarget.LIGHTS, command_state
        )
        return True

    async def list_vehicles(self):
        return await self._vehicle_repository.list_all_vehicle_ids_async()

    async def provision_vehicle(self, entity_id: int, vin: str) -> bool:
        # Check if the vehicle already exists in the repository
        vehicle_state = await self._vehicle_repository.find_vehicle_by_entity_id_async(
            entity_id
        )
        if vehicle_state:
            self._logger.info(f"Vehicle already exists: {entity_id}")
            # TODO: check provisioning status and reprovision if needed
            # Assuming this is an invalid case for now
            return False

        self._vehicle_repository.add_vehicle(VehicleState(vin, entity_id))
        self._command_publisher.create_lock_publisher(self._session, vin)
        self._command_publisher.create_turn_on_off_publisher(self._session, vin)
        return True
