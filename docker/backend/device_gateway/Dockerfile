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
