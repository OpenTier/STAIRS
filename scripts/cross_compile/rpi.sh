#!/bin/bash

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
