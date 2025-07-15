# Copyright (c) 2025 by OpenTier GmbH
# SPDX-FileCopyrightText: 2025 OpenTier GmbH
# SPDX-License-Identifier: LGPL-3.0-or-later

# This file is part of OpenTier.

# This is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.

# This is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.

# You should have received a copy of the GNU Lesser General Public
# License along with this file.  If not, see <https://www.gnu.org/licenses/>.

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

# Run the application
CMD ["node", "dist/main"]