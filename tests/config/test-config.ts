// Copyright (c) 2025 by OpenTier GmbH
// SPDX-FileCopyrightText: 2025 OpenTier GmbH
// SPDX-License-Identifier: LGPL-3.0-or-later
//
// This file is part of OpenTier.
//
// This is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 3 of the
// License, or (at your option) any later version.
//
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this file.  If not, see <https://www.gnu.org/licenses/>.

// Test configuration with environment-aware URLs
export const getApiBaseUrls = () => {
  // Check if running in Docker container
  const isDocker =
    process.env.CI === "true" || process.env.DOCKER_ENV === "true";

  return {
    STAIRS_API: isDocker
      ? "http://stairs_api:3001"
      : "http://localhost:3001",
  };
};

export const API_URLS = getApiBaseUrls();
