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

// Function to parse the timespan into seconds
export function parseTimespanToSeconds(timespan) {
  const match = timespan.match(/^-(\d+)([smhdw])$/); // Regex to match format like '-1d', '-30m'
  if (!match) {
    throw new Error('Invalid timespan format');
  }

  const value = parseInt(match[1], 10); // Extract the numeric part
  const unit = match[2]; // Extract the time unit

  // Convert to seconds based on the unit
  const unitToSeconds = {
    s: 1, // seconds
    m: 60, // minutes
    h: 3600, // hours
    d: 86400, // days
    w: 604800, // weeks
  };

  return value * unitToSeconds[unit];
}
