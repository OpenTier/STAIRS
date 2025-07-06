#!/bin/bash

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