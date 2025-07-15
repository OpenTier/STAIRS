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

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from typing import Optional, List
from device_gateway.twin.vehicle_state import VehicleState
import logging


class VehicleRepository:

    def __init__(self, mongo_uri: str) -> None:
        # Asynchronous client
        self.async_client = AsyncIOMotorClient(mongo_uri)
        self.async_database = self.async_client.vehicles

        # Synchronous client
        self.sync_client = MongoClient(mongo_uri)
        self.sync_database = self.sync_client.vehicles

        self._vehicle_cache: dict[str, VehicleState] = {}
        self._logger = logging.getLogger(__name__)

    # Asynchronous methods
    async def find_vehicle_by_vehicle_id_async(
        self, vehicle_id: str
    ) -> Optional[VehicleState]:
        # Check in cache first
        if vehicle_id in self._vehicle_cache:
            return self._vehicle_cache[vehicle_id]

        # Fetch from MongoDB if not in cache
        vehicle_data = await self.async_database.vehicles.find_one(
            {"vehicle_id": vehicle_id}
        )
        if vehicle_data:
            vehicle_state = VehicleState.from_dict(vehicle_data)

            # Cache the result
            self._vehicle_cache[vehicle_id] = vehicle_state
            return vehicle_state
        else:
            self._logger.warning(f"Vehicle not found: {vehicle_id}")
            return None

    async def find_vehicle_by_entity_id_async(
        self, entity_id: int
    ) -> Optional[VehicleState]:
        # Fetch from MongoDB by entity_id
        vehicle_data = await self.async_database.vehicles.find_one(
            {"entity_id": entity_id}
        )
        if vehicle_data:
            vehicle_state = VehicleState.from_dict(vehicle_data)

            # Cache the result
            self._vehicle_cache[vehicle_state.vehicle_id] = vehicle_state
            return vehicle_state
        else:
            self._logger.warning(f"Vehicle not found with entity_id: {entity_id}")
            return None

    async def list_all_vehicle_ids_async(self) -> List[str]:
        # Fetch all vehicle_ids from MongoDB
        cursor = self.async_database.vehicles.find({}, {"vehicle_id": 1, "_id": 0})
        vehicle_ids = [document["vehicle_id"] async for document in cursor]
        return vehicle_ids

    async def add_vehicle_async(self, vehicle: VehicleState) -> None:
        # Add to cache
        if vehicle.vehicle_id not in self._vehicle_cache:
            self._vehicle_cache[vehicle.vehicle_id] = vehicle

        # Serialize VehicleState to dictionary and save to MongoDB
        vehicle_dict = vehicle.to_dict()
        await self.async_database.vehicles.update_one(
            {"vehicle_id": vehicle.vehicle_id}, {"$set": vehicle_dict}, upsert=True
        )

    async def remove_vehicle_async(self, vehicle_id: str) -> None:
        # Remove from cache
        if vehicle_id in self._vehicle_cache:
            del self._vehicle_cache[vehicle_id]

        # Remove from MongoDB
        result = await self.async_database.vehicles.delete_one(
            {"vehicle_id": vehicle_id}
        )
        if result.deleted_count > 0:
            self._logger.info(f"Vehicle removed: {vehicle_id}")
        else:
            self._logger.warning(f"Vehicle not found for removal: {vehicle_id}")

    # Synchronous methods
    def find_vehicle_by_vehicle_id(self, vehicle_id: str) -> Optional[VehicleState]:
        # Check in cache first
        if vehicle_id in self._vehicle_cache:
            return self._vehicle_cache[vehicle_id]

        # Fetch from MongoDB if not in cache
        vehicle_data = self.sync_database.vehicles.find_one({"vehicle_id": vehicle_id})
        if vehicle_data:
            vehicle_state = VehicleState.from_dict(vehicle_data)
            # Cache the result
            self._vehicle_cache[vehicle_id] = vehicle_state
            return vehicle_state
        else:
            self._logger.warning(f"Vehicle not found: {vehicle_id}")
            return None

    def find_vehicle_by_entity_id(self, entity_id: int) -> Optional[VehicleState]:
        # Fetch from MongoDB by entity_id
        vehicle_data = self.sync_database.vehicles.find_one({"entity_id": entity_id})
        if vehicle_data:
            vehicle_state = VehicleState.from_dict(vehicle_data)
            # Cache the result
            self._vehicle_cache[vehicle_state.vehicle_id] = vehicle_state
            return vehicle_state
        else:
            self._logger.warning(f"Vehicle not found with entity_id: {entity_id}")
            return None

    def list_all_vehicle_ids(self) -> List[str]:
        # Fetch all vehicle_ids from MongoDB
        cursor = self.sync_database.vehicles.find({}, {"vehicle_id": 1, "_id": 0})
        vehicle_ids = [document["vehicle_id"] for document in cursor]
        return vehicle_ids

    def add_vehicle(self, vehicle: VehicleState) -> None:
        # Add to cache
        if vehicle.vehicle_id not in self._vehicle_cache:
            self._vehicle_cache[vehicle.vehicle_id] = vehicle

        # Serialize VehicleState to dictionary and save to MongoDB
        vehicle_dict = vehicle.to_dict()
        self.sync_database.vehicles.update_one(
            {"vehicle_id": vehicle.vehicle_id}, {"$set": vehicle_dict}, upsert=True
        )

    def remove_vehicle(self, vehicle_id: str) -> None:
        # Remove from cache
        if vehicle_id in self._vehicle_cache:
            del self._vehicle_cache[vehicle_id]

        # Remove from MongoDB
        result = self.sync_database.vehicles.delete_one({"vehicle_id": vehicle_id})
        if result.deleted_count > 0:
            self._logger.info(f"Vehicle removed: {vehicle_id}")
        else:
            self._logger.warning(f"Vehicle not found for removal: {vehicle_id}")

    def close(self):
        self.async_client.close()
        self.sync_client.close()
