# Use Ubuntu 22 as the base image
FROM ubuntu:22.04

ARG UNAME=dev
ARG UID=1000
ARG GID=1000

ARG ZENOH_VERSION=1.0.0-beta.4
ARG NODEJS_VERSION=20
ARG PLANTUML_VERSION=1.2024.6

# Pre-configure tzdata to avoid interactive prompt
ENV TZ=UTC
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    vim \
    libssl-dev \
    pkg-config \
    locales \
    sudo \
    curl \
    git \
    build-essential \
    bash-completion \
    bsdmainutils \
    unzip \
    xz-utils \
    zip \
    strace \
    libglu1-mesa \
    libfontconfig1-dev \
    libxcb1-dev \
    libxcb-render0-dev \
    libxcb-shape0-dev \
    libxcb-xfixes0-dev \
    libxkbcommon-dev \
    libinput-dev \
    libgbm-dev\
    libxkbcommon-x11-dev \
    clang \
    cmake \
    ninja-build \
    libgtk-3-dev \
    graphviz \
    python3 \
    python3-pip \
    python-is-python3 \
    protobuf-compiler \
    postgresql-client \
    openjdk-17-jdk \
    tmux && \
    # Add Node.js repository
    curl -fsSL https://deb.nodesource.com/setup_${NODEJS_VERSION}.x | bash - && \
    apt-get install -y nodejs

# Install Python 3.8
RUN DEBIAN_FRONTEND=noninteractive  apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update && apt-get install -y \
    python3.8 python3.8-venv python3.8-dev python3-pip \
    && apt-get clean

# Install pre-commit hook
RUN pip install pre-commit

# Set locale environment variables
ENV LANGUAGE=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8

# Install MongoDB client tools
RUN apt-get update && \
    apt-get install -y gnupg && \
    curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
    gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-8.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org-shell mongodb-mongosh

# Generate locale
RUN locale-gen en_US.UTF-8

# Create a user with the same UID and GID as the host user
RUN groupadd -g $GID $UNAME && \
    useradd -m -s /bin/bash -u $UID -g $GID $UNAME && \
    echo "$UNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Install Flutter
RUN curl -L https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz -o flutter.tar.xz \
    && tar -xf flutter.tar.xz -C /usr/local/bin \
    && rm -rf flutter.tar.xz \
    # Add Flutter to safe directories to be able to recognize it's version
    && git config --global --add safe.directory /usr/local/bin/flutter

# Set up Zenoh Router
RUN curl -L https://github.com/eclipse-zenoh/zenoh/releases/download/${ZENOH_VERSION}/zenoh-${ZENOH_VERSION}-x86_64-unknown-linux-gnu-standalone.zip -o zenoh.zip \
    && unzip zenoh.zip -d /usr/local/bin \
    && rm -rf zenoh.zip

# Download PlantUML, move it to /usr/local/bin/, and make it executable
RUN curl -L "https://github.com/plantuml/plantuml/releases/download/v${PLANTUML_VERSION}/plantuml-${PLANTUML_VERSION}.jar" -o /usr/local/bin/plantuml.jar \
    && echo -e '#!/bin/sh\njava -jar /usr/local/bin/plantuml.jar "$@"' > /usr/local/bin/plantuml \
    && chmod +x /usr/local/bin/plantuml

# Setup mkdocs
RUN pip install mkdocs mkdocs-material mkdocs-awesome-pages-plugin mkdocs-macros-plugin mkdocs-build-plantuml-plugin vss-tools fastapi[standard]

# Install Yarn, OpenAPI generator and AsyncAPI generator and NestJS
RUN npm install -g yarn \
    @openapitools/openapi-generator-cli @asyncapi/cli @asyncapi/nodejs-ws-template \
    @nestjs/cli @nestjs/swagger @nestjs/microservices nestjs-asyncapi && \
    chown -R $UNAME:$UNAME /usr/lib/node_modules

# Install Influx CLI client
RUN curl -LO https://download.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-linux-amd64.tar.gz && \
    tar xvzf influxdb2-client-2.7.5-linux-amd64.tar.gz && \
    sudo cp influx /usr/local/bin/ && \
    rm -rf influxdb2-client-2.7.5-linux-amd64.tar.gz

# Switch to the new user
USER $UNAME
RUN mkdir -p /home/$UNAME/workspace

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Copy the Git branch showing and coloring script
COPY show_git_branch.sh /home/${UNAME}/show_git_branch.sh
# Add Python bin to path and append the content of show_git_branch.sh to .bashrc
RUN echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/${UNAME}/.bashrc && \
    cat /home/${UNAME}/show_git_branch.sh >> /home/${UNAME}/.bashrc

# Define the default command
CMD ["bash"]
