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
