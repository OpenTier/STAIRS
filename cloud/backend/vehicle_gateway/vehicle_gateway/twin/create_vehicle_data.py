from vehicle_gateway.generated import vehicle_msgs_pb2


def create_vehicle_data():
    # Create a new Vehicle message
    vehicle = vehicle_msgs_pb2.Vehicle()

    # Set default values for Acceleration
    vehicle.Acceleration.Lateral = 0
    vehicle.Acceleration.Longitudinal = 0
    vehicle.Acceleration.Vertical = 0

    # Set default values for Angular Velocity
    vehicle.AngularVelocity.Pitch = 0
    vehicle.AngularVelocity.Roll = 0
    vehicle.AngularVelocity.Yaw = 0

    # Set default values for Average Speed
    vehicle.AverageSpeed = 0

    # Set default values for Vehicle Body (Horn, Lights, Trunk)
    vehicle.Body.Horn.IsActive = False

    # Set default values for Lights
    vehicle.Body.Lights.Beam.High.IsDefect = False
    vehicle.Body.Lights.Beam.High.IsOn = False
    vehicle.Body.Lights.Beam.Low.IsDefect = False
    vehicle.Body.Lights.Beam.Low.IsOn = False
    vehicle.Body.Lights.Brake.IsActive = "true"
    vehicle.Body.Lights.Brake.IsDefect = False
    vehicle.Body.Lights.DirectionIndicator.Left.IsDefect = False
    vehicle.Body.Lights.DirectionIndicator.Left.IsSignaling = False
    vehicle.Body.Lights.DirectionIndicator.Right.IsDefect = False
    vehicle.Body.Lights.DirectionIndicator.Right.IsSignaling = False
    vehicle.Body.Lights.Hazard.IsDefect = False
    vehicle.Body.Lights.Hazard.IsSignaling = False
    vehicle.Body.Lights.IsHighBeamSwitchOn = False
    vehicle.Body.Lights.LicensePlate.IsDefect = False
    vehicle.Body.Lights.LicensePlate.IsOn = False
    vehicle.Body.Lights.LightSwitch = "Auto"
    vehicle.Body.Lights.Parking.IsDefect = False
    vehicle.Body.Lights.Parking.IsOn = False
    vehicle.Body.Lights.Running.IsDefect = False
    vehicle.Body.Lights.Running.IsOn = False

    # Set default values for Trunk
    vehicle.Body.Trunk.Rear.IsLightOn = False
    vehicle.Body.Trunk.Rear.IsLocked = True
    vehicle.Body.Trunk.Rear.IsOpen = False

    # Set default values for Chassis (Accelerator, Brake, Steering, etc.)
    vehicle.Chassis.Accelerator.PedalPosition = 0

    # Set default values for Axle Row 1
    vehicle.Chassis.Axle.Row1.AxleWidth = 0
    vehicle.Chassis.Axle.Row1.SteeringAngle = 0
    vehicle.Chassis.Axle.Row1.TireAspectRatio = 0
    vehicle.Chassis.Axle.Row1.TireDiameter = 0
    vehicle.Chassis.Axle.Row1.TireWidth = 0
    vehicle.Chassis.Axle.Row1.TrackWidth = 0
    vehicle.Chassis.Axle.Row1.TreadWidth = 0
    vehicle.Chassis.Axle.Row1.Wheel.Left.AngularSpeed = 0
    vehicle.Chassis.Axle.Row1.Wheel.Left.Speed = 0
    vehicle.Chassis.Axle.Row1.Wheel.Left.Brake.FluidLevel = 0
    vehicle.Chassis.Axle.Row1.Wheel.Left.Brake.IsBrakesWorn = False
    vehicle.Chassis.Axle.Row1.Wheel.Left.Brake.IsFluidLevelLow = False
    vehicle.Chassis.Axle.Row1.Wheel.Left.Brake.PadWear = 0
    vehicle.Chassis.Axle.Row1.Wheel.Left.Tire.IsPressureLow = False
    vehicle.Chassis.Axle.Row1.Wheel.Left.Tire.Pressure = 0
    vehicle.Chassis.Axle.Row1.Wheel.Left.Tire.Temperature = 0

    # Set default values for Axle Row 2
    vehicle.Chassis.Axle.Row2.AxleWidth = 0
    vehicle.Chassis.Axle.Row2.SteeringAngle = 0
    vehicle.Chassis.Axle.Row2.TireAspectRatio = 0
    vehicle.Chassis.Axle.Row2.TireDiameter = 0
    vehicle.Chassis.Axle.Row2.TireWidth = 0
    vehicle.Chassis.Axle.Row2.TrackWidth = 0
    vehicle.Chassis.Axle.Row2.TreadWidth = 0
    vehicle.Chassis.Axle.Row2.Wheel.Left.AngularSpeed = 0
    vehicle.Chassis.Axle.Row2.Wheel.Left.Speed = 0
    vehicle.Chassis.Axle.Row2.Wheel.Left.Brake.FluidLevel = 0
    vehicle.Chassis.Axle.Row2.Wheel.Left.Brake.IsBrakesWorn = False
    vehicle.Chassis.Axle.Row2.Wheel.Left.Brake.IsFluidLevelLow = False
    vehicle.Chassis.Axle.Row2.Wheel.Left.Brake.PadWear = 0
    vehicle.Chassis.Axle.Row2.Wheel.Left.Tire.IsPressureLow = False
    vehicle.Chassis.Axle.Row2.Wheel.Left.Tire.Pressure = 0
    vehicle.Chassis.Axle.Row2.Wheel.Left.Tire.Temperature = 0

    # Set default values for Chassis Brake
    vehicle.Chassis.Brake.IsDriverEmergencyBrakingDetected = False
    vehicle.Chassis.Brake.PedalPosition = 0

    # Set default values for Steering Wheel
    vehicle.Chassis.SteeringWheel.Angle = 0
    vehicle.Chassis.SteeringWheel.Extension = 0
    vehicle.Chassis.SteeringWheel.HeatingCooling = 0
    vehicle.Chassis.SteeringWheel.Tilt = 0

    # Set default values for other fields
    vehicle.CurbWeight = 0
    vehicle.CurrentLocation.Altitude = 0
    vehicle.CurrentLocation.Heading = 0
    vehicle.CurrentLocation.HorizontalAccuracy = 0
    vehicle.CurrentLocation.Latitude = 0
    vehicle.CurrentLocation.Longitude = 0
    vehicle.CurrentLocation.Timestamp = ""
    vehicle.CurrentLocation.VerticalAccuracy = 0
    vehicle.CurrentOverallWeight = 0

    # Set default values for Diagnostics
    vehicle.Diagnostics.DTCCount = 0
    vehicle.Diagnostics.DTCList.extend([])

    # Set default values for Exterior
    vehicle.Exterior.AirTemperature = 0
    vehicle.Exterior.Humidity = 0
    vehicle.Exterior.LightIntensity = 0

    # Set default values for Low Voltage Battery
    vehicle.LowVoltageBattery.CurrentCurrent = 0
    vehicle.LowVoltageBattery.CurrentVoltage = 0
    vehicle.LowVoltageBattery.NominalCapacity = 0
    vehicle.LowVoltageBattery.NominalVoltage = 0

    # Set default values for Powertrain and Traction Battery
    vehicle.Powertrain.TractionBattery.StateOfHealth = 0

    # Set default values for Speed, Trip, and Vehicle Identification
    vehicle.Speed = 0
    vehicle.TraveledDistance = 0
    vehicle.VehicleIdentification.VIN = "DEFAULT_VIN"

    return vehicle
