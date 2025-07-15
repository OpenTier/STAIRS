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

# Base image
FROM debian:bookworm-slim

# Install necessary dependencies, including wget and GPG tools
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y ca-certificates
RUN echo "deb [trusted=yes] https://download.eclipse.org/zenoh/debian-repo/ /" | tee -a /etc/apt/sources.list > /dev/null && \
    apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y zenohd zenoh-plugin-rest zenoh-plugin-storage-manager zenoh-backend-influxdb-v2 && \
    apt clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy Zenoh configuration file
COPY docker/backend/cloud_router/zenoh_config.json5 /app/zenoh_config.json5

# Set the default command to run the Zenoh router with the configuration file
CMD ["zenohd", "-c", "/app/zenoh_config.json5"]
