FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY cloud/backend/stairs_api/package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY cloud/backend/stairs_api/ .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20-slim AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the first stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.demo ./

# Expose the application port
EXPOSE 3001

# Set the environment variables
ENV NODE_ENV=demo

# Run the application
CMD ["node", "dist/main"]