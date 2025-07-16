#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Configuration
PI_USER="demo"
PI_HOST="u-opentier-rpi5.local" # or IP address 192.168.50.174 or "u-opentier-pi4.local" for RPI4
PI_PORT=22
REMOTE_DIR="/home/demo/app"

# Paths
BUILD_TARGET="aarch64-unknown-linux-gnu"
BUILD_DIR="target/$BUILD_TARGET/release"

echo "Ensure that you added your SSH Key using: ssh-copy-id -p $PI_PORT $PI_USER@$PI_HOST"

# Functions
function check_and_install_rust {
    # Check if cargo is installed
    if ! command -v cargo &> /dev/null
    then
        echo "Cargo is not installed. Installing Rust and Cargo..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source $HOME/.cargo/env
    else
        echo "Cargo is already installed."
    fi
}

function check_and_install_cross {
    # Check if cross is installed
    if ! cargo install --list | grep -q "cross v"
    then
        echo "Cross is not installed. Installing Cross..."
        cargo install cross --git https://github.com/cross-rs/cross
    else
        echo "Cross is already installed."
    fi
}

function build_binaries {
    echo "Building binaries for Raspberry Pi..."
    ./scripts/cross_compile/rpi.sh release
}

function stop_services {
    echo "Stopping running services on Raspberry Pi..."
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
sudo systemctl stop zenoh_router.service || true
sudo systemctl stop update_client.service || true
sudo systemctl stop twin_service.service || true
sudo systemctl stop signal_mocker_service.service || true
sudo systemctl stop dashboard.service || true
EOF
}

function copy_files {
    echo "Cleaning remote directory on Raspberry Pi..."
    ssh -p $PI_PORT $PI_USER@$PI_HOST "rm -rf $REMOTE_DIR/*"

    echo "Copying files to Raspberry Pi..."
    ssh -p $PI_PORT $PI_USER@$PI_HOST "mkdir -p $REMOTE_DIR"
    scp -P $PI_PORT $BUILD_DIR/update_client $PI_USER@$PI_HOST:$REMOTE_DIR/
    scp -P $PI_PORT $BUILD_DIR/dashboard $PI_USER@$PI_HOST:$REMOTE_DIR/
    scp -P $PI_PORT $BUILD_DIR/twin_service $PI_USER@$PI_HOST:$REMOTE_DIR/
    scp -P $PI_PORT $BUILD_DIR/signal_mocker_service $PI_USER@$PI_HOST:$REMOTE_DIR/

    echo "Copying configuration files..."
    scp -P $PI_PORT vehicle/signal_mocker_service/config/mock_data.json5 $PI_USER@$PI_HOST:$REMOTE_DIR/
    scp -P $PI_PORT vehicle/twin_service/config/twin_config.json5 $PI_USER@$PI_HOST:$REMOTE_DIR/
    scp -P $PI_PORT vehicle/twin_service/config/vehicle_initial_state.json5 $PI_USER@$PI_HOST:$REMOTE_DIR/

    # Check if zenohd is already downloaded on the host, if not, download it
    ZENOH_ZIP="zenoh-1.0.0-aarch64-unknown-linux-gnu-standalone.zip"
    ZENOH_BIN="zenohd"

    if [ ! -f "$ZENOH_ZIP" ]; then
        echo "Downloading Zenoh Router..."
        curl -L -o "$ZENOH_ZIP" "https://github.com/eclipse-zenoh/zenoh/releases/download/1.0.0/$ZENOH_ZIP"
    else
        echo "Zenoh Router already downloaded."
    fi

    # Unzip Zenoh Router if zenohd binary doesn't exist
    if [ ! -f "$ZENOH_BIN" ]; then
        echo "Unzipping Zenoh Router..."
        unzip -o "$ZENOH_ZIP" -d zenoh_extracted
        mv zenoh_extracted/zenohd .  # Move the zenohd binary to the current directory
        rm -rf zenoh_extracted  # Clean up the unzipped folder
    else
        echo "Zenoh Router binary already extracted."
    fi

    # Copy Zenoh Router to Raspberry Pi
    echo "Copying Zenoh Router to Raspberry Pi..."
    scp -P $PI_PORT zenohd $PI_USER@$PI_HOST:$REMOTE_DIR/

    # Copy Zenoh configuration file to Raspberry Pi
    echo "Copying Zenoh configuration to Raspberry Pi..."
    scp -P $PI_PORT ./scripts/deploy/zenoh_config.json5 $PI_USER@$PI_HOST:$REMOTE_DIR/
}

function install_dependencies {
    echo "Installing dependencies on Raspberry Pi..."
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \\
    libx11-xcb1 \\
    libxkbcommon-x11-0 \\
    x11-apps \\
    libxcursor1 \\
    libxi6 \\
    libxcb-glx0 \\
    libxcb-keysyms1 \\
    libxcb-image0 \\
    libxcb-shm0 \\
    libxcb-icccm4 \\
    libxcb-sync1 \\
    libxcb-xfixes0 \\
    libxcb-shape0 \\
    libxcb-randr0 \\
    libxcb-render-util0 \\
    libxrender1 \\
    libxcb1 \\
    libfontconfig1 \\
    libfreetype6 \\
    libqt5gui5 \\
    libqt5core5a \\
    libqt5widgets5
EOF
}

function setup_services {
    echo "Setting up services on Raspberry Pi..."

    # Create systemd service for Zenoh Router
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
cat > /tmp/zenoh_router.service << EOL
[Unit]
Description=Zenoh Router
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=$REMOTE_DIR/zenohd -c $REMOTE_DIR/zenoh_config.json5
Restart=always
User=$PI_USER
WorkingDirectory=$REMOTE_DIR

[Install]
WantedBy=multi-user.target
EOL

sudo mv /tmp/zenoh_router.service /etc/systemd/system/zenoh_router.service
EOF

    # Reload systemd and enable Zenoh Router service
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
sudo systemctl daemon-reload
sudo systemctl enable zenoh_router.service
sudo systemctl start zenoh_router.service
EOF

    # Create systemd service for update_client
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
cat > /tmp/update_client.service << EOL
[Unit]
Description=Update Client Service
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/home/demo/app/update_client
Restart=always
User=$PI_USER
WorkingDirectory=$REMOTE_DIR

[Install]
WantedBy=multi-user.target
EOL

sudo mv /tmp/update_client.service /etc/systemd/system/update_client.service
EOF

    # Create systemd service for twin_service
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
cat > /tmp/twin_service.service << EOL
[Unit]
Description=Twin Service
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/home/demo/app/twin_service --twin-config /home/demo/app/twin_config.json5 --vehicle-state-config /home/demo/app/vehicle_initial_state.json5
Restart=always
User=$PI_USER
WorkingDirectory=$REMOTE_DIR

[Install]
WantedBy=multi-user.target
EOL

sudo mv /tmp/twin_service.service /etc/systemd/system/twin_service.service
EOF

    # Create systemd service for signal_mocker_service
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
cat > /tmp/signal_mocker_service.service << EOL
[Unit]
Description=Signal Mocker Service
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/home/demo/app/signal_mocker_service --config /home/demo/app/mock_data.json5
Restart=always
User=$PI_USER
WorkingDirectory=$REMOTE_DIR

[Install]
WantedBy=multi-user.target
EOL

sudo mv /tmp/signal_mocker_service.service /etc/systemd/system/signal_mocker_service.service
EOF

    # Create systemd service for dashboard
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
cat > /tmp/dashboard.service << EOL
[Unit]
Description=Dashboard Service
Wants=network-online.target
After=network-online.target

[Service]
Environment=SLINT_BACKEND=Qt
Environment=DISPLAY=:0
Environment=SLINT_FULLSCREEN=1
ExecStart=/home/demo/app/dashboard
Restart=always
User=$PI_USER
WorkingDirectory=$REMOTE_DIR

[Install]
WantedBy=multi-user.target
EOL

sudo mv /tmp/dashboard.service /etc/systemd/system/dashboard.service
EOF

    # Reload systemd and enable all services
    ssh -p $PI_PORT $PI_USER@$PI_HOST << EOF
sudo systemctl daemon-reload
sudo systemctl enable update_client.service
sudo systemctl enable twin_service.service
sudo systemctl enable signal_mocker_service.service
sudo systemctl enable dashboard.service
sudo systemctl restart update_client.service
sudo systemctl restart twin_service.service
sudo systemctl restart signal_mocker_service.service
sudo systemctl restart dashboard.service
EOF
}


# Main script execution
check_and_install_rust
check_and_install_cross
build_binaries
stop_services
copy_files
install_dependencies
setup_services

echo "Deployment to Raspberry Pi completed successfully."
