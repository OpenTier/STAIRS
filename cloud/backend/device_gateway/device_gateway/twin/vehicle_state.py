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


class VehicleState:
    def __init__(
        self,
        vehicle_id: str,
        entity_id: int,
    ) -> None:
        self.vehicle_id = vehicle_id
        self.entity_id = entity_id

    def to_dict(self) -> dict:
        """Convert VehicleState to a dictionary for MongoDB storage."""
        return {
            "vehicle_id": self.vehicle_id,
            "entity_id": self.entity_id,
        }

    @staticmethod
    def from_dict(data: dict) -> "VehicleState":
        """Convert a dictionary from MongoDB to a VehicleState object."""
        return VehicleState(
            vehicle_id=data["vehicle_id"],
            entity_id=data.get("entity_id"),
        )
