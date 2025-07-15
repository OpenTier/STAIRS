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

import { DeviceStatus } from '../interfaces/device.interfaces';

const seedDevices = [
  {
    code: 'VEHICLE1VIN',
    make: 'Velocitia',
    model: 'Stratus EV-S',
    name: 'Fleet Car #7',
    color: 'blue',
    year: 2025,
    image: 'https://example.com/images/stratus-ev.png',
    provisionStatus: DeviceStatus.ACTIVE,
  },
  {
    code: 'thermo-003958',
    make: 'HeatSync',
    model: 'T900-Pro',
    name: 'Living Room Thermostat',
    color: 'white',
    year: 2023,
    image: 'https://example.com/images/thermostat.png',
    provisionStatus: DeviceStatus.ACTIVE,
  },
  {
    code: 'iaq-plant-00212',
    make: 'AeroSense',
    model: 'AQX-500',
    name: 'Factory Zone A - Sensor',
    color: 'gray',
    year: 2022,
    image: 'https://example.com/images/air-quality.png',
    provisionStatus: DeviceStatus.ACTIVE,
  },
  {
    code: 'scooter-11235',
    make: 'UrbanGo',
    model: 'X2-EV',
    name: 'Scooter #11235',
    color: 'black',
    year: 2024,
    image: 'https://example.com/images/scooter-black.png',
    provisionStatus: DeviceStatus.ACTIVE,
  },
  {
    code: 'lock-78421',
    make: 'SecureHive',
    model: 'Lockit-X',
    name: 'Front Door Lock',
    color: 'silver',
    year: 2021,
    image: 'https://example.com/images/doorlock.png',
    provisionStatus: DeviceStatus.MAINTENANCE,
  },
  {
    code: 'wx-44321',
    make: 'ClimaTrack',
    model: 'CT-WX1000',
    name: 'Rooftop Weather Station',
    color: 'white',
    year: 2023,
    image: 'https://example.com/images/weatherstation.png',
    provisionStatus: DeviceStatus.INACTIVE,
  },
];

export default seedDevices;
