from vehicle_gateway.twin.vehicle_state import VehicleState, VehicleType
from vehicle_gateway.twin.vehicle_state_subscriber import VehicleStateSubscriber
from vehicle_gateway.twin.robot_state_subscriber import RobotStateSubscriber
from vehicle_gateway.twin.vehicle_command_publisher import (
    VehicleCommandPublisher,
    LockState,
    CommandState,
    CommandTarget,
)
from vehicle_gateway.twin.robot_command_publisher import RobotCommandPublisher
from vehicle_gateway.twin.robot_state import RobotState
import zenoh
import logging
import json
from vehicle_gateway.configuration import Configuration
from vehicle_gateway.db.influx_writer import InfluxWriter
from vehicle_gateway.db.vehicle_repository import VehicleRepository
from vehicle_gateway.twin.create_vehicle_data import create_vehicle_data
import httpx
from fastapi import HTTPException
from typing import Optional


class TwinService:

    def __init__(self) -> None:
        self._logger = logging.getLogger(__name__)
        self._vehicle_repository: VehicleRepository = None
        self._command_publisher: VehicleCommandPublisher = None
        self._robot_command_publisher: RobotCommandPublisher = None
        self._vehicle_subscriber: VehicleStateSubscriber = None
        self._robot_subscriber: RobotStateSubscriber = None

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
        self._robot_subscriber = RobotStateSubscriber(
            self._session, self._vehicle_repository
        )

        # Initialize publishers
        self._command_publisher = VehicleCommandPublisher(self._session)
        self._robot_command_publisher = RobotCommandPublisher(self._session)

        self._logger.info("Initializing vehicle and robot connections...")

        ids = await self._vehicle_repository.list_all_vehicle_ids_async()
        for vehicle_id in ids:
            vehicle_state = (
                await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
                    vehicle_id
                )
            )

            if vehicle_state.type == VehicleType.ROBOT:
                self._logger.info(f"Creating publishers for robot: {vehicle_id}")
                self._robot_command_publisher.create_publisher(vehicle_id)
            elif vehicle_state.type == VehicleType.SCOOTER and vehicle_state.is_real():
                self._logger.info(f"Creating publishers for scooter: {vehicle_id}")
                self._command_publisher.create_lock_publisher(self._session, vehicle_id)
                self._command_publisher.create_turn_on_off_publisher(
                    self._session, vehicle_id
                )
            elif (
                vehicle_state.type == VehicleType.SCOOTER
                and not vehicle_state.is_real()
            ):
                self._logger.info("Skipping adding a simulated scooter.")
            else:
                self._logger.error(
                    f"Unknown or unsupported vehicle type: {vehicle_state.type}"
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

        if not vehicle_state.can_lock_unlock(lock):
            self._logger.info("Vehicle cannot be locked/unlocked")
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

        if not vehicle_state.can_turn_on_off_horn(on):
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

        if not vehicle_state.can_turn_on_off_light(on):
            return False

        command_state = CommandState.ON if on else CommandState.OFF
        self._command_publisher.publish_turn_on_off_command(
            vehicle_state.vehicle_id, CommandTarget.LIGHTS, command_state
        )
        return True

    async def list_vehicles(self):
        return await self._vehicle_repository.list_all_vehicle_ids_async()

    async def provision_vehicle(
        self, entity_id: int, simulated: bool, vin: str
    ) -> bool:
        # Check if the vehicle already exists in the repository
        vehicle_state = await self._vehicle_repository.find_vehicle_by_entity_id_async(
            entity_id
        )
        if vehicle_state:
            self._logger.info(f"Vehicle already exists: {entity_id}")
            # TODO: check provisioning status and reprovision if needed
            # Assuming this is an invalid case for now
            return False

        if simulated:
            return await self._spawn_simulated_vehicle(entity_id)
        else:
            self._vehicle_repository.add_vehicle(
                VehicleState(vin, entity_id, True, create_vehicle_data())
            )
            self._command_publisher.create_lock_publisher(self._session, vin)
            self._command_publisher.create_turn_on_off_publisher(self._session, vin)
            return True

    async def _spawn_simulated_vehicle(self, entity_id: str) -> Optional[int]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url=f"{Configuration.SIM_SERVICE_ENDPOINT}/api/v1/vehicles",
                )
                response.raise_for_status()

                # Extract vehicle ID from the response
                response_data = response.json()
                self._logger.info(f"Response: {response_data}")
                vehicle_id = response_data.get("vehicle_id")
                if not vehicle_id:
                    self._logger.error("Missing 'vehicle_id' in the response")
                    return False

                self._logger.info(f"Vehicle spawned: {entity_id} -> {vehicle_id}")
                # Create vehicle data
                vehicle_data = create_vehicle_data()

                # Create a new vehicle state and add it to the repository
                vehicle_state = VehicleState(vehicle_id, entity_id, False, vehicle_data)
                self._logger.info(f"Vehicle state created: {vehicle_state}")
                await self._vehicle_repository.add_vehicle_async(vehicle_state)
                self._logger.info(f"Vehicle added to repository: {vehicle_state}")

                self._logger.info(f"Vehicle provisioned: {entity_id} -> {vehicle_id}")

                # Create command publishers for the vehicle
                self._command_publisher.create_lock_publisher(self._session, vehicle_id)
                self._command_publisher.create_turn_on_off_publisher(
                    self._session, vehicle_id
                )

                self._logger.info(
                    f"Command publishers created for vehicle: {vehicle_id}"
                )

                return True

            except httpx.RequestError as e:
                self._logger.error(
                    f"Network request error while provisioning vehicle "
                    f"{entity_id}: {str(e)}"
                )
                raise HTTPException(
                    status_code=500, detail=f"Network request error: {str(e)}"
                )

            except httpx.HTTPStatusError as e:
                self._logger.error(
                    f"HTTP error while provisioning vehicle {entity_id}: "
                    f"Status {e.response.status_code}, Detail: {e.response.text}"
                )
                raise HTTPException(
                    status_code=e.response.status_code,
                    detail=f"HTTP error: {e.response.text}",
                )

            except KeyError as e:
                self._logger.error(f"Unexpected response format: Missing key {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Unexpected response format: Missing key {str(e)}",
                )

            except Exception as e:
                self._logger.error(
                    f"Unexpected error while provisioning vehicle {entity_id}: {str(e)}"
                )
                raise HTTPException(
                    status_code=500, detail=f"Unexpected error: {str(e)}"
                )

    async def get_robot_state(self, robot_id: str) -> Optional[RobotState]:
        """Get robot state by robot_id"""
        return await self._vehicle_repository.find_vehicle_by_vehicle_id_async(robot_id)

    async def provision_robot(self, robot_id: str) -> bool:
        """Provision a new robot"""
        # Check if robot already exists
        robot_state = await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
            robot_id
        )
        if robot_state:
            self._logger.info(f"Robot already exists: {robot_id}")
            return False

        vehicle_data = create_vehicle_data()
        robot_state = RobotState(robot_id, robot_id, vehicle_data)
        await self._vehicle_repository.add_vehicle_async(robot_state)

        self._robot_command_publisher.create_publisher(robot_id)
        return True

    async def is_valid_robot(self, robot_id: str) -> bool:
        """Check if a robot exists and is valid

        Returns:
            True if robot exists and is valid
            False otherwise
        """
        robot_state = await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
            robot_id
        )

        if not robot_state:
            self._logger.warning(f"Robot {robot_id} not found in repository")
            return False

        if robot_state.type != VehicleType.ROBOT:
            self._logger.warning(f"Vehicle {robot_id} exists but is not a robot")
            return False

        return True

    async def robot_kick(self, robot_id: str, power: float) -> bool:
        """Send kick command to robot"""
        if not await self.is_valid_robot(robot_id):
            return False

        robot_state = await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
            robot_id
        )
        if not robot_state.can_kick(power):
            return False

        self._robot_command_publisher.publish_kick_command(robot_id, power)
        return True

    async def robot_control(
        self, robot_id: str, dx: float, dy: float, dturn: float
    ) -> bool:
        """Send movement control command to robot"""
        if not await self.is_valid_robot(robot_id):
            return False

        robot_state = await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
            robot_id
        )
        if not robot_state.can_move(dx, dy, dturn):
            return False

        self._robot_command_publisher.publish_control_command(robot_id, dx, dy, dturn)
        return True

    async def robot_leds(self, robot_id: str, red: int, green: int, blue: int) -> bool:
        """Send LED control command to robot"""
        if not await self.is_valid_robot(robot_id):
            return False

        robot_state = await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
            robot_id
        )
        if not robot_state.can_control_leds(red, green, blue):
            return False

        self._robot_command_publisher.publish_leds_command(robot_id, red, green, blue)
        return True

    async def robot_beep(self, robot_id: str, frequency: int, duration: int) -> bool:
        """Send beep command to robot"""
        if not await self.is_valid_robot(robot_id):
            return False

        robot_state = await self._vehicle_repository.find_vehicle_by_vehicle_id_async(
            robot_id
        )
        if not robot_state.can_beep(frequency, duration):
            return False

        self._robot_command_publisher.publish_beep_command(
            robot_id, frequency, duration
        )

        return True

    async def unprovision_robot(self, robot_id: str) -> bool:
        """Unprovision/delete a robot"""
        if not await self.is_valid_robot(robot_id):
            return False

        await self._vehicle_repository.remove_vehicle_async(robot_id)

        # Remove the publisher if it exists
        if hasattr(self, "_robot_command_publisher") and self._robot_command_publisher:
            self._robot_command_publisher.remove_publisher(robot_id)

        return True
