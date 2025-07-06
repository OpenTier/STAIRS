# Base image
FROM debian:bookworm-slim

# Install necessary dependencies, including wget and GPG tools
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y ca-certificates
RUN echo "deb [trusted=yes] https://download.eclipse.org/zenoh/debian-repo/ /" | tee -a /etc/apt/sources.list > /dev/null && \
    apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y zenohd zenoh-plugin-rest zenoh-plugin-storage-manager zenoh-backend-influxdb-v2 && \
    apt clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy Zenoh configuration file
COPY docker/backend/cloud_router/zenoh_config.json5 /app/zenoh_config.json5

# Set the default command to run the Zenoh router with the configuration file
CMD ["zenohd", "-c", "/app/zenoh_config.json5"]
