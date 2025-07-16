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