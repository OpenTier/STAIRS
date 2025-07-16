#!/bin/bash
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
