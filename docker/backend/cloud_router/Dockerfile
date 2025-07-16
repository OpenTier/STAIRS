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
