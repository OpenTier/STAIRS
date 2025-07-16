# Copyright (c) 2025 by OpenTier GmbH
# SPDX‑FileCopyrightText: 2025 OpenTier GmbH
# SPDX‑License‑Identifier: MIT

# This file is part of OpenTier.

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

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
