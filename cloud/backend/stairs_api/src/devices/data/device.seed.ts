// Copyright (c) 2025 by OpenTier GmbH
// SPDX‑FileCopyrightText: 2025 OpenTier GmbH
// SPDX‑License‑Identifier: MIT
//
// This file is part of OpenTier.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
