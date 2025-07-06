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
COPY cloud/backend/vehicle_gateway/pyproject.toml /app/
COPY cloud/backend/vehicle_gateway/poetry.lock /app/

# Copy vehicle API files
COPY api/ /app/api/

# Install the Python dependencies
RUN poetry lock && poetry install --no-root

# Copy the rest of the application code
COPY cloud/backend/vehicle_gateway /app

# Generate API code
RUN cd /app && python -c "from scripts import generate_proto; generate_proto('/app/api/vehicle-cloud-api/proto', '/app/vehicle_gateway/generated', True)"

# Set the entrypoint command to Vehicle Gateway
CMD ["poetry", "run", "fastapi", "run", "/app/vehicle_gateway/main.py", "--host", "0.0.0.0", "--port", "8005"]
