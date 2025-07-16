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
