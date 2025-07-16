# Use Node.js LTS as base image
FROM node:18-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY tests/package*.json ./

# Install Node.js dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of the test files
COPY tests/ .

# Copy wait script
COPY docker/unified_tests/wait-for-services.sh /wait-for-services.sh
RUN chmod +x /wait-for-services.sh

# Set the command to wait for services then run tests
CMD ["/wait-for-services.sh"]
