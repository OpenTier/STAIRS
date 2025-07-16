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

# scripts.py

import subprocess
import os


def format_code():
    subprocess.run(["black", "device_gateway/"])


def lint_code():
    subprocess.run(["flake8", "device_gateway/"])


def generate_proto(
    proto_path: str = "../../../api/vehicle-cloud-api/proto",
    proto_out="./device_gateway/generated",
    fix_imports=True,
):
    print("Generating proto...")

    proto_files = [
        "vehicle_cloud_events.proto",
        "vehicle_commands.proto",
    ]

    # ensure that the generated directory exists
    subprocess.run(["mkdir", "-p", proto_out])

    # Generate protos
    for proto_file in proto_files:
        print(f"Generating {proto_file}...")
        subprocess.run(
            [
                "protoc",
                f"--proto_path={proto_path}",
                f"--python_out={proto_out}",
                f"{proto_path}/{proto_file}",
            ]
        )
    if fix_imports:
        # Fix imports in generated files
        for generated_file in [
            f"{proto_out}/vehicle_cloud_events_pb2.py",
            f"{proto_out}/vehicle_commands_pb2.py",
        ]:
            if not os.path.exists(generated_file):
                continue

            with open(generated_file, "r") as f:
                content = f.read()

            imports_to_fix = [
                "import vehicle_cloud_events_pb2",
                "import vehicle_commands_pb2",
            ]

            for imp in imports_to_fix:
                if imp in content:
                    content = content.replace(
                        imp, f"from device_gateway.generated {imp}"
                    )

            with open(generated_file, "w") as f:
                f.write(content)

    print("Proto generation complete.")


def run_dev():
    print("Running development server...")
    generate_proto()
    subprocess.run(["fastapi", "dev", "--port", "8005", "device_gateway/main.py"])


def run_prod():
    print("Running production server...")
    generate_proto()
    subprocess.run(["fastapi", "run", "--port", "8005", "device_gateway/main.py"])
