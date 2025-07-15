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

# Function to display usage
usage() {
    echo "Usage: $0 <yaml_file> <template> <output_dir>"
    echo ""
    echo "Generate code from an AsyncAPI YAML file using a specified template."
    echo ""
    echo "Arguments:"
    echo "  <yaml_file>   Path to the AsyncAPI YAML file."
    echo "  <template>    Template to use for code generation (e.g., @asyncapi/java-spring-template)."
    echo "  <output_dir>  Output directory for the generated code."
    echo ""
    exit 1
}

# Check if the correct number of arguments are provided
if [ $# -ne 3 ]; then
    usage
fi

# Assign arguments to variables
YAML_FILE=$1
TEMPLATE=$2
OUTPUT_DIR=$3

# Run the asyncapi generate command
asyncapi generate fromTemplate "$YAML_FILE" "$TEMPLATE" -o "$OUTPUT_DIR"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Code generation completed successfully."
else
    echo "Error: Code generation failed."
    exit 1
fi
