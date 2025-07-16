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

# Default values for YAML files
UNITS_YAML_DEFAULT="api/vehicle/units.yaml"
QUANTITIES_YAML_DEFAULT="api/vehicle/quantities.yaml"
VSS_YAML_DEFAULT="api/vehicle/vss_scooter_signals.yaml"

# Default output file name
OUTPUT_FILE_DEFAULT="api/vehicle/vehicle_msgs.proto"

# Usage function to display help
usage() {
    echo "Usage: $0 [-u units_yaml] [-q quantities_yaml] [-v vss_yaml] [-o output_file]"
    echo ""
    echo "Optional arguments:"
    echo "  -u  Path to units.yaml (default: $UNITS_YAML_DEFAULT)"
    echo "  -q  Path to quantities.yaml (default: $QUANTITIES_YAML_DEFAULT)"
    echo "  -v  Path to vss.yaml (default: $VSS_YAML_DEFAULT)"
    echo "  -o  Output file name (default: $OUTPUT_FILE_DEFAULT)"
    exit 1
}

# Parse command line arguments
while getopts ":u:q:v:o:h" opt; do
  case ${opt} in
    u )
      UNITS_YAML=$OPTARG
      ;;
    q )
      QUANTITIES_YAML=$OPTARG
      ;;
    v )
      VSS_YAML=$OPTARG
      ;;
    o )
      OUTPUT_FILE=$OPTARG
      ;;
    h )
      usage
      ;;
    \? )
      echo "Invalid option: $OPTARG" 1>&2
      usage
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      usage
      ;;
  esac
done

# Set default values if not provided via command line
UNITS_YAML=${UNITS_YAML:-$UNITS_YAML_DEFAULT}
QUANTITIES_YAML=${QUANTITIES_YAML:-$QUANTITIES_YAML_DEFAULT}
VSS_YAML=${VSS_YAML:-$VSS_YAML_DEFAULT}
OUTPUT_FILE=${OUTPUT_FILE:-$OUTPUT_FILE_DEFAULT}

# Call vspec2protobuf.py with the required arguments
vspec2protobuf.py -u "$UNITS_YAML" -q "$QUANTITIES_YAML" "$VSS_YAML" "$OUTPUT_FILE"
