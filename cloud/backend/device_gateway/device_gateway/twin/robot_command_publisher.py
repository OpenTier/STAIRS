import zenoh
import logging
from fastapi import HTTPException
from google.protobuf.message import Message
from typing import Dict
from device_gateway.generated import robot_soccer_pb2


class RobotCommandPublisher:
    ROBOT_CONTROL_TOPIC = "vehicle/{robot_id}/robot_control"

    def __init__(self, session: zenoh.Session) -> None:
        self._session = session
        self._logger = logging.getLogger(__name__)
        self._publishers: Dict[str, zenoh.Publisher] = {}

    def create_publisher(self, robot_id: str) -> None:
        """Create a publisher for a specific robot"""
        if robot_id not in self._publishers:
            topic = self.ROBOT_CONTROL_TOPIC.format(robot_id=robot_id)
            self._publishers[robot_id] = self._session.declare_publisher(topic)
            self._logger.info(
                f"Created publisher for robot {robot_id} on topic {topic}"
            )

    def remove_publisher(self, robot_id: str) -> None:
        """Remove a publisher for a specific robot"""
        if robot_id in self._publishers:
            self._publishers[robot_id].undeclare()
            del self._publishers[robot_id]
            self._logger.info(f"Removed publisher for robot {robot_id}")

    def _publish_command(self, robot_id: str, command: Message) -> None:
        """Generic method to publish a command"""
        if robot_id not in self._publishers:
            self._logger.error(f"No publisher found for robot {robot_id}")
            raise HTTPException(status_code=400, detail=f"Robot {robot_id} not found")

        self._publishers[robot_id].put(command.SerializeToString())
        self._logger.info(f"Published command for robot {robot_id}")

    def publish_kick_command(self, robot_id: str, power: float) -> None:
        """Publish a kick command"""
        packet = robot_soccer_pb2.RobotPacket(robot_id=int(robot_id))
        kick = robot_soccer_pb2.Kick(power=power)
        command = robot_soccer_pb2.RobotCommand()
        command.kick.CopyFrom(kick)
        packet.command.CopyFrom(command)
        self._publish_command(robot_id, packet)

    def publish_control_command(
        self, robot_id: str, dx: float, dy: float, dturn: float
    ) -> None:
        """Publish a movement control command"""
        packet = robot_soccer_pb2.RobotPacket(robot_id=int(robot_id))
        control = robot_soccer_pb2.Control(dx=dx, dy=dy, dturn=dturn)
        command = robot_soccer_pb2.RobotCommand()
        command.control.CopyFrom(control)
        packet.command.CopyFrom(command)
        self._publish_command(robot_id, packet)

    def publish_leds_command(
        self, robot_id: str, red: int, green: int, blue: int
    ) -> None:
        """Publish an LED control command"""
        packet = robot_soccer_pb2.RobotPacket(robot_id=int(robot_id))
        leds = robot_soccer_pb2.Leds(red=red, green=green, blue=blue)
        command = robot_soccer_pb2.RobotCommand()
        command.leds.CopyFrom(leds)
        packet.command.CopyFrom(command)
        self._publish_command(robot_id, packet)

    def publish_beep_command(
        self, robot_id: str, frequency: int, duration: int
    ) -> None:
        """Publish a beep command"""
        packet = robot_soccer_pb2.RobotPacket(robot_id=int(robot_id))
        beep = robot_soccer_pb2.Beep(frequency=frequency, duration=duration)
        command = robot_soccer_pb2.RobotCommand()
        command.beep.CopyFrom(beep)
        packet.command.CopyFrom(command)
        self._publish_command(robot_id, packet)
