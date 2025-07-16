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

# Use the official Python base image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Install curl and other dependencies to install Poetry
RUN apt-get update && apt-get install -y curl protobuf-compiler && apt-get clean

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

# Copy only the necessary files first to leverage Docker caching
COPY cloud/backend/device_gateway/pyproject.toml /app/
COPY cloud/backend/device_gateway/poetry.lock /app/

# Copy vehicle API files
COPY api/ /app/api/

# Set a longer timeout (in seconds) for Poetry’s HTTP requests
ENV POETRY_REQUESTS_TIMEOUT=120
# (Optional) Also set pip’s default timeout in case Poetry falls back to pip directly
ENV PIP_DEFAULT_TIMEOUT=120

# Disable parallel installs (avoids a known Docker+Poetry race condition)
RUN poetry config installer.parallel false

# Install the Python dependencies
RUN poetry lock && poetry install --no-root

# Copy the rest of the application code
COPY cloud/backend/device_gateway /app

# Generate API code
RUN cd /app && python -c "from scripts import generate_proto; generate_proto('/app/api/vehicle-cloud-api/proto', '/app/device_gateway/generated', True)"

# Set the entrypoint command to Device Gateway
CMD ["poetry", "run", "fastapi", "run", "/app/device_gateway/main.py", "--host", "0.0.0.0", "--port", "8005"]
