#/bin/bash

echo "Cleaning up vehicles data volumes"

docker compose down

docker volume rm open-tier-platform_influxdb_config \
    open-tier-platform_influxdb_data \
    open-tier-platform_mongodb_data \
    open-tier-platform_postgres_data

echo "Cleared InfluxDB, MongoDB, and PostgreSQL data volumes"
