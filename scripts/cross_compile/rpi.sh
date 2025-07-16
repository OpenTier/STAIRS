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

set -e  # Exit immediately if a command exits with a non-zero status

# Function to display usage information
usage() {
    echo "Usage: $0 [debug|release|both]"
    echo "  debug   - Build the debug profile (default)"
    echo "  release - Build the release profile"
    echo "  both    - Build both debug and release profiles"
    exit 1
}

# Check if the first argument is provided, default to 'debug' if not
BUILD_TYPE=${1:-debug}

# Validate the build type
if [[ "$BUILD_TYPE" != "debug" && "$BUILD_TYPE" != "release" && "$BUILD_TYPE" != "both" ]]; then
    echo "Error: Invalid build type '$BUILD_TYPE'"
    usage
fi

echo "Starting cross compilation for Raspberry Pi ($BUILD_TYPE build)"

# Build the Docker image for cross compilation
echo "Building the Docker image for cross compilation"
docker build -t cross-rpi docker/cross/rpi

# Cross compile for Raspberry Pi based on the specified build type
if [ "$BUILD_TYPE" = "debug" ]; then
    echo "Cross compiling for Raspberry Pi (debug build)"
    cross build --target aarch64-unknown-linux-gnu
elif [ "$BUILD_TYPE" = "release" ]; then
    echo "Cross compiling for Raspberry Pi (release build)"
    cross build --release --target aarch64-unknown-linux-gnu
elif [ "$BUILD_TYPE" = "both" ]; then
    echo "Cross compiling for Raspberry Pi (debug build)"
    cross build --target aarch64-unknown-linux-gnu
    echo "Cross compiling for Raspberry Pi (release build)"
    cross build --release --target aarch64-unknown-linux-gnu
fi
