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

# Function to display usage information
usage() {
    echo "Usage: $0 <API_PATH> <GENERATOR> <OUTPUT>"
    echo "  API_PATH   Path to the OpenAPI specification file"
    echo "  GENERATOR  Generator type (e.g., java, python, etc.)"
    echo "  OUTPUT     Output directory for the generated code"
    exit 1
}

# Check if sufficient arguments are provided
if [ "$#" -ne 3 ]; then
    usage
fi

API_PATH="$1"
GENERATOR="$2"
OUTPUT="$3"

# Check if the API path exists
if [ ! -f "$API_PATH" ]; then
    echo "Error: API path '$API_PATH' does not exist."
    exit 1
fi

# Run the OpenAPI generator
if npx @openapitools/openapi-generator-cli generate -i "$API_PATH" -g "$GENERATOR" -o "$OUTPUT"; then
    echo "Code generation completed successfully."
else
    echo "Error: Code generation failed."
    exit 1
fi