import os


class Configuration:
    INFLUXDB_ORG = os.environ.get("INFLUXDB_ORG", "OpenTier")
    INFLUXDB_TOKEN = os.environ.get("INFLUXDB_TOKEN", "my-secret-token")
    INFLUXDB_HOST = os.environ.get("INFLUXDB_HOST", "http://localhost:8086")
    INFLUXDB_BUCKET = os.environ.get("INFLUXDB_BUCKET", "telemetry")
    ZENOH_CLOUD_ENTRYPOINTS = [
        # Cloud entrypoints:
        "tcp/172.20.0.13:7447",
        "udp/172.20.0.13:7447",
        # Local entrypoints:
        "tcp/[::]:7447",
        "udp/[::]:7447",
    ]
    BACKEND_CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://localhost:8080",
        "http://172.20.0.10:3000",
        "http://172.20.0.11:3001",
    ]
    MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://mongodb:27017")
    DEMO_MODE = os.environ.get("DEMO_MODE", "true") == "true"

    SPEED_TOPIC = os.getenv("SPEED_TOPIC", "cloud/telemetry/speed")
    EXTERIOR_TOPIC = os.getenv("EXTERIOR_TOPIC", "cloud/telemetry/exterior")
    LOCATION_TOPIC = os.getenv("LOCATION_TOPIC", "cloud/telemetry/location")
    TIRES_TOPIC = os.getenv("TIRES_TOPIC", "cloud/telemetry/tires")
    SYSTEM_STATE_TOPIC = os.getenv("SYSTEM_STATE_TOPIC", "cloud/telemetry/system_state")
    TRIP_DATA_TOPIC = os.getenv("TRIP_DATA_TOPIC", "cloud/telemetry/trip_data")
    BATTERY_EVENT_TOPIC = os.getenv(
        "BATTERY_EVENT_TOPIC", "cloud/telemetry/battery_event"
    )
