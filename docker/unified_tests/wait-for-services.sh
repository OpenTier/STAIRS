#!/bin/bash
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

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Waiting for services to be ready...${NC}"

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=60
    local attempt=1

    echo -e "${YELLOW}⏳ Waiting for $service_name at $url...${NC}"

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}🔄 Attempt $attempt/$max_attempts: $service_name not ready yet...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done

    echo -e "${RED}❌ $service_name failed to become ready after $max_attempts attempts${NC}"
    return 1
}

# Wait for backend services (for API tests)
echo -e "${YELLOW}🚀 Checking backend services...${NC}"
wait_for_service "http://stairs_api:3001/devices" "STAIRS API" || echo -e "${YELLOW}⚠️ STAIRS API not available - API tests may fail${NC}"
wait_for_service "http://device_gateway:8005/health" "Device Gateway" || echo -e "${YELLOW}⚠️ Device Gateway not available - API tests may fail${NC}"

echo -e "${GREEN}🎯 Service checks complete! Starting tests...${NC}"

# Run the tests with the provided arguments or default command
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}🧪 Running all tests...${NC}"
    exec npx playwright test
else
    echo -e "${YELLOW}🧪 Running tests with custom arguments: $@${NC}"
    exec npx playwright test "$@"
fi
