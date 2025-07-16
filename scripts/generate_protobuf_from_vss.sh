#!/bin/bash

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
