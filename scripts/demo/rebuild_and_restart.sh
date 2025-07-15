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

echo "Cleaning up vehicles data volumes"

docker compose down

docker volume rm open-tier-platform_influxdb_config \
    open-tier-platform_influxdb_data \
    open-tier-platform_mongodb_data \
    open-tier-platform_postgres_data

echo "Cleared InfluxDB, MongoDB, and PostgreSQL data volumes"

echo "Rebuilding"
docker compose build

echo "Starting"
docker compose up