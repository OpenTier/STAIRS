import zenoh
import logging
from vehicle_gateway.db.vehicle_repository import VehicleRepository
from vehicle_gateway.generated import robot_soccer_pb2
from vehicle_gateway.twin.robot_state import RobotState


class RobotStateSubscriber:
    ROBOT_STATUS_TOPIC = "cloud/telemetry/robot_status"

    def __init__(
        self,
        session: zenoh.Session,
        repository: VehicleRepository,
    ) -> None:
        self._session = session
        self._repository = repository
        self._logger = logging.getLogger(__name__)

        self._subscribe(session, self.ROBOT_STATUS_TOPIC, self.on_robot_status)

    def on_robot_status(self, sample: zenoh.Sample):
        """Handle incoming robot status updates"""
        try:
            packet = robot_soccer_pb2.RobotPacket()
            packet.ParseFromString(sample.payload.__bytes__())

            robot_id = str(packet.robot_id)
            robot = self._repository.find_vehicle_by_vehicle_id(robot_id)

            if robot is None:
                self._logger.warning(f"Robot {robot_id} not provisioned")
                return

            if not isinstance(robot, RobotState):
                self._logger.error(f"Vehicle {robot_id} exists but is not a robot")
                return

            self._logger.info(
                f"Robot {robot_id} status: "
                f"battery={packet.status.battery_info.battery_level:.2f}, "
                f"running={packet.status.is_running}"
            )

            robot.update_robot_status(packet)
            self._repository.add_vehicle(robot)

        except Exception as e:
            self._logger.error(f"Failed to process robot status: {e}")

    def _subscribe(
        self, session: zenoh.Session, key_expr: str, handler: callable
    ) -> None:
        session.declare_subscriber(key_expr=key_expr, handler=handler)
