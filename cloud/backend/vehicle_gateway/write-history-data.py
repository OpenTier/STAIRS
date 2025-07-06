# Goal:
#   Have a Python script to populate InfluxDB with some history data for the vehicles
#   (to have data to show in history graphs)
#   Run once to create a history for vehicles whose ids are in the vehicles array
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime, timedelta, timezone
import random

# Configurations
#   1. vehicle IDs
vehicles = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
#   2. Number of samples to divide the timezone to
nbSamples = 30  # 30 (frontend expectation)
#   3. Variance in mean, to avoid having a similar mean for all measurements
varianceInMean = 20

# Variables
vehicleMaxEngine = 200.00
lastUsedMaxEngine = vehicleMaxEngine
lastUsedMinEngine = 0.00
vehicleMaxBattery = 100.00
lastUsedMaxBattery = vehicleMaxBattery
lastUsedMinBattery = 0.00
vehicleMaxSpeed = 200.00
lastUsedMaxSpeed = vehicleMaxSpeed
lastUsedMinSpeed = 0.00
vehicleMaxPressure = 50
lastUsedMaxPressure = vehicleMaxPressure
lastUsedMinPressure = 0

# Credentials
token = "my-secret-token"
org = "OpenTier"
bucket = "telemetry"
url = "http://localhost:8086"

# Initialize the client
client = InfluxDBClient(url=url, token=token, org=org)

# Initialize the write API
write_api = client.write_api(write_options=SYNCHRONOUS)


# Get mean value
def get_mean_value(max, min, isInt):
    mean = ((max - min) / 2) + random.uniform(0, varianceInMean)
    if isInt:
        return int(mean)
    else:
        return mean


# Update thresholds
def update_thresholds():
    # fmt: off
    global lastUsedMaxEngine, lastUsedMinEngine, \
        lastUsedMaxBattery, lastUsedMinBattery, \
        lastUsedMaxSpeed, lastUsedMinSpeed, \
        lastUsedMaxPressure, lastUsedMinPressure
    # fmt: on
    lastUsedMaxEngine = (
        (lastUsedMaxEngine - 1)
        if lastUsedMaxEngine > vehicleMaxEngine / 2
        else vehicleMaxEngine
    )
    lastUsedMinEngine = (
        (lastUsedMinEngine + 1) if lastUsedMinEngine < vehicleMaxEngine / 2 else 0.00
    )
    lastUsedMaxBattery = (
        (lastUsedMaxBattery - 1)
        if lastUsedMaxBattery > vehicleMaxBattery / 2
        else vehicleMaxBattery
    )
    lastUsedMinBattery = (
        (lastUsedMinBattery + 1) if lastUsedMinBattery < vehicleMaxBattery / 2 else 0.00
    )
    lastUsedMaxSpeed = (
        (lastUsedMaxSpeed - 1)
        if lastUsedMaxSpeed > vehicleMaxSpeed / 2
        else vehicleMaxSpeed
    )
    lastUsedMinSpeed = (
        (lastUsedMinSpeed + 1) if lastUsedMinSpeed < vehicleMaxSpeed / 2 else 0.00
    )
    lastUsedMaxPressure = (
        (lastUsedMaxPressure - 1)
        if lastUsedMaxPressure > vehicleMaxPressure / 2
        else vehicleMaxPressure
    )
    lastUsedMinPressure = (
        (lastUsedMinPressure + 1) if lastUsedMinPressure < vehicleMaxPressure / 2 else 0
    )


def updateVehicleMaxThresholds():
    global vehicleMaxEngine, vehicleMaxBattery, vehicleMaxSpeed, vehicleMaxPressure
    vehicleMaxEngine = vehicleMaxEngine - 5
    vehicleMaxBattery = vehicleMaxBattery - 5
    vehicleMaxSpeed = vehicleMaxSpeed - 5
    vehicleMaxPressure = vehicleMaxPressure - 3


# Create a point to write
def write_vehicle_data(vehicleId, temperature, charge, velocity, pressure, timestamp):
    # engine: for now remove to be consistnet with vehicle
    # engine = Point("engine").tag("vehicle_id", vehicleId)
    # engine.field("temperature", temperature)
    # engine.time(timestamp)

    # battery
    battery = Point("battery").tag("vehicle_id", vehicleId)
    battery.field("battery_level", charge)
    battery.field("temperature", temperature)
    battery.time(timestamp)

    # speed
    speed = Point("speed").tag("vehicle_id", vehicleId)
    speed.field("speed", velocity)
    speed.time(timestamp)

    # tires
    tires = Point("tires").tag("vehicle_id", vehicleId)
    tires.field("front_tire_pressure", pressure)
    tires.time(timestamp)

    # Write data to InfluxDB
    # write_api.write(bucket=bucket, org=org, record=engine)
    write_api.write(bucket=bucket, org=org, record=battery)
    write_api.write(bucket=bucket, org=org, record=speed)
    write_api.write(bucket=bucket, org=org, record=tires)


def write_samples(vehicleId, timeIncrement, offset):
    timestamp = (
        datetime.now(timezone.utc)
        - timedelta(days=offset)
        + timedelta(days=offset * timeIncrement / nbSamples)
    )
    # Max:
    write_vehicle_data(
        vehicleId,
        lastUsedMaxEngine,
        lastUsedMaxBattery,
        lastUsedMaxSpeed,
        lastUsedMaxPressure,
        timestamp,
    )
    # Min:
    timestamp = timestamp + timedelta(
        seconds=1
    )  # to avoid overwriting the previous point
    write_vehicle_data(
        vehicleId,
        lastUsedMinEngine,
        lastUsedMinBattery,
        lastUsedMinSpeed,
        lastUsedMinPressure,
        timestamp,
    )
    # Update thresholds:
    update_thresholds()


try:
    for vehicle in vehicles:
        for i in range(
            1, nbSamples - 1
        ):  # ignore the last sample to avoid disrupting live data
            # Year
            write_samples(vehicle, i, 360)
            # Month
            write_samples(vehicle, i, 30)
            # Week
            write_samples(vehicle, i, 7)
            # Day
            write_samples(vehicle, i, 1)

            print(vehicle, i)
        updateVehicleMaxThresholds()

finally:
    # Close the client
    client.close()
