from device_gateway.twin.vehicle_state import VehicleState, VehicleType
from device_gateway.generated import vehicle_msgs_pb2, robot_soccer_pb2
from typing import Optional
import logging


class RobotState(VehicleState):
    def __init__(
        self,
        robot_id: str,  # This will be used as vehicle_id in base class
        entity_id: int,
        state: Optional["vehicle_msgs_pb2.Vehicle"] = None,
    ) -> None:
        super().__init__(robot_id, entity_id, True, state, VehicleType.ROBOT)
        self._logger = logging.getLogger(__name__)

    def can_kick(self, power: float) -> bool:
        return 0.0 <= power <= 1.0

    def can_move(self, dx: float, dy: float, dturn: float) -> bool:
        # TODO: Add validation logic for movement commands
        # For now, always allow movement
        return True

    def can_control_leds(self, red: int, green: int, blue: int) -> bool:
        return all(0 <= x <= 255 for x in [red, green, blue])

    def can_beep(self, frequency: int, duration: int) -> bool:
        return frequency > 0 and duration > 0

    def update_robot_status(self, packet: robot_soccer_pb2.RobotPacket) -> None:
        """Update robot status from incoming data"""
        if not packet.HasField("status"):
            self._logger.warning("Received robot packet without status")
            return

        if str(packet.robot_id) != self.vehicle_id:
            self._logger.warning(
                f"Received status for robot {packet.robot_id} "
                f"but this is robot {self.vehicle_id}"
            )
            return

        status = packet.status
        self.state.Powertrain.TractionBattery.StateOfCharge.Displayed = (
            status.battery_info.battery_level
        )

        self.state.IsMoving = status.is_running

        self.state.StartTime = str(status.timestamp)
