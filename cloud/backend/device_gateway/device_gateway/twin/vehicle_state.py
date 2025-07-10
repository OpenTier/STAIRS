from device_gateway.generated import vehicle_msgs_pb2
from google.protobuf.json_format import MessageToJson, Parse
from device_gateway.twin.create_vehicle_data import create_vehicle_data
from typing import Optional
from enum import Enum


class DeviceType(Enum):
    VEHICLE = "vehicle"
    ROBOT = "robot"


class VehicleState:
    def __init__(
        self,
        vehicle_id: str,
        entity_id: int,
        state: Optional["vehicle_msgs_pb2.Vehicle"],
        type: DeviceType = DeviceType.VEHICLE,
    ) -> None:
        self.vehicle_id = vehicle_id
        self.entity_id = entity_id
        self.type = type

        if state is None:
            self.state = create_vehicle_data()
        else:
            self.state = state

    def to_dict(self) -> dict:
        """Convert VehicleState to a dictionary for MongoDB storage."""
        return {
            "vehicle_id": self.vehicle_id,
            "entity_id": self.entity_id,
            "state": MessageToJson(self.state),
            "type": self.type.value,
        }

    @staticmethod
    def from_dict(data: dict) -> "VehicleState":
        """Convert a dictionary from MongoDB to a VehicleState object."""
        state = vehicle_msgs_pb2.Vehicle()
        Parse(data["state"], state)
        return VehicleState(
            vehicle_id=data["vehicle_id"],
            entity_id=data.get("entity_id"),
            state=state,
            type=DeviceType(data.get("type")),
        )

    def update_battery_data(self, data):
        self.state.Powertrain.TractionBattery.Charging.IsCharging = data.is_charging
        self.state.Powertrain.TractionBattery.Charging.IsDischarging = (
            data.is_discharging
        )
        self.state.Powertrain.TractionBattery.Charging.TimeToComplete = (
            data.time_to_fully_charge
        )
        self.state.Powertrain.TractionBattery.Range = data.estimated_range
        self.state.Powertrain.TractionBattery.StateOfCharge.Displayed = (
            data.battery_level
        )
        self.state.Powertrain.TractionBattery.StateOfHealth = data.state_of_health
        self.state.Powertrain.TractionBattery.Temperature.Average = data.temperature

    def update_location_data(self, data):
        self.state.CurrentLocation.Altitude = data.altitude
        self.state.CurrentLocation.Latitude = data.latitude
        self.state.CurrentLocation.Longitude = data.longitude
        self.state.CurrentLocation.Timestamp = data.timestamp

    def update_speed_data(self, data):
        self.state.Speed = data.speed

    def update_exterior_data(self, data):
        self.state.Exterior.AirTemperature = data.air_temperature
        self.state.Exterior.Humidity = data.humidity
        self.state.Exterior.LightIntensity = data.light_intensity

    def update_trip_data(self, data):
        self.state.StartTime = data.start_time
        self.state.TraveledDistance = data.traveled_distance
        self.state.TraveledDistanceSinceStart = data.traveled_distance_since_start
        self.state.TripDuration = data.trip_duration
        self.state.TripMeterReading = data.trip_meter_reading
        self.state.AverageSpeed = data.average_speed

    def update_lock_state_data(self, data):
        self.state.LowVoltageSystemState = data.system_state

    def update_tires_data(self, data):
        self.state.Chassis.Axle.Row1.Wheel.Left.Tire.Pressure = data.front_tire.pressure
        self.state.Chassis.Axle.Row2.Wheel.Left.Tire.Pressure = data.rear_tire.pressure

    def can_lock_unlock(self, lock: bool) -> bool:
        # TODO: Implement the logic to check if the vehicle can be locked or unlocked
        # We can base this on the current speed of the vehicle,
        # the state of the engine, etc.
        return True

    def can_turn_on_off_horn(self, on: bool) -> bool:
        # TODO: Implement the logic to check if the horn can be turned on or off
        return True

    def can_turn_on_off_light(self, on: bool) -> bool:
        # TODO: Implement the logic to check if the light can be turned on or off
        return True
