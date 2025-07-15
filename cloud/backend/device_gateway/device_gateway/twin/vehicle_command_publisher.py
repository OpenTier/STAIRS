# Copyright (c) 2025 by OpenTier GmbH
# SPDX-FileCopyrightText: 2025 OpenTier GmbH
# SPDX-License-Identifier: LGPL-3.0-or-later

# This file is part of OpenTier.

# This is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.

# This is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.

# You should have received a copy of the GNU Lesser General Public
# License along with this file.  If not, see <https://www.gnu.org/licenses/>.

import zenoh
import device_gateway.generated.vehicle_commands_pb2 as vehicle_commands_pb2
import logging
from enum import Enum
from fastapi import HTTPException


class CommandState(Enum):
    OFF = 0
    ON = 1


class LockState(Enum):
    UNLOCK = 0
    LOCK = 1


class CommandTarget(Enum):
    LIGHTS = 0
    HORN = 1
    DOORS = 2
    ENGINE = 3


class VehicleCommandPublisher:

    def __init__(self, session: zenoh.Session) -> None:
        self._logger = logging.getLogger(__name__)
        self._lock_publishers = dict()
        self._turn_on_off_publishers = dict()

    def create_lock_publisher(
        self, session: zenoh.Session, vehicle_id: str
    ) -> zenoh.Publisher:
        publisher = session.declare_publisher(f"cloud/command/{vehicle_id}/lock")
        self._lock_publishers[vehicle_id] = publisher

    def create_turn_on_off_publisher(
        self, session: zenoh.Session, vehicle_id: str
    ) -> zenoh.Publisher:
        publisher = session.declare_publisher(f"cloud/command/{vehicle_id}/turn_on_off")
        self._turn_on_off_publishers[vehicle_id] = publisher

    def publish_lock_unlock_command(self, vehicle_id: str, state: LockState) -> None:
        self._logger.info(f"Publishing lock/unlock command for vehicle {vehicle_id}")
        lock_state = (
            vehicle_commands_pb2.LockState.LOCK
            if state == LockState.LOCK
            else vehicle_commands_pb2.LockState.UNLOCK
        )
        command = vehicle_commands_pb2.LockUnlockCommand(state=lock_state)

        if vehicle_id in self._lock_publishers:
            self._lock_publishers[vehicle_id].put(command.SerializeToString())
            self._logger.info(f"Published lock/unlock command for vehicle {vehicle_id}")
        else:
            self._logger.error(f"Publisher for vehicle {vehicle_id} does not exist")
            raise HTTPException(
                status_code=400, detail=f"Vehicle {vehicle_id} does not exists"
            )

    def publish_turn_on_off_command(
        self, vehicle_id: str, target: CommandTarget, state: CommandState
    ) -> None:
        self._logger.info(f"Publishing turn on/off command for vehicle {vehicle_id}")
        command_target = None
        if target == CommandTarget.LIGHTS:
            command_target = vehicle_commands_pb2.CommandTarget.LIGHTS
        elif target == CommandTarget.HORN:
            command_target = vehicle_commands_pb2.CommandTarget.HORN
        elif target == CommandTarget.ENGINE:
            command_target = vehicle_commands_pb2.CommandTarget.ENGINE
        else:
            self._logger.error(f"Invalid CommandTarget: {target}")
            raise HTTPException(
                status_code=400, detail=f"Invalid CommandTarget: {target}"
            )

        on_off_state = (
            vehicle_commands_pb2.CommandState.ON
            if state == CommandState.ON
            else vehicle_commands_pb2.CommandState.OFF
        )

        command = vehicle_commands_pb2.GeneralStateCommand(
            target=command_target, state=on_off_state
        )

        if vehicle_id in self._turn_on_off_publishers:
            self._turn_on_off_publishers[vehicle_id].put(command.SerializeToString())
            self._logger.info(f"Published turn on/off command for vehicle {vehicle_id}")
        else:
            self._logger.error(f"Publisher for vehicle {vehicle_id} does not exist")
            raise HTTPException(
                status_code=400, detail=f"Vehicle {vehicle_id} does not exists"
            )
