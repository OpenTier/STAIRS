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
        "vehicle_msgs.proto",
        "robot_soccer.proto",
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
            f"{proto_out}/robot_soccer_pb2.py",
            f"{proto_out}/vehicle_cloud_events_pb2.py",
            f"{proto_out}/vehicle_commands_pb2.py",
            f"{proto_out}/vehicle_msgs_pb2.py",
        ]:
            if not os.path.exists(generated_file):
                continue

            with open(generated_file, "r") as f:
                content = f.read()

            imports_to_fix = [
                "import vehicle_cloud_events_pb2",
                "import vehicle_commands_pb2",
                "import vehicle_msgs_pb2",
                "import robot_soccer_pb2",
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
