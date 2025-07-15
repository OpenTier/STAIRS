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

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create_device.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({
    status: 200,
    description: 'Return all devices',
    type: [Device],
  })
  getAllDevices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a device by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all devices',
    type: Device,
  })
  @ApiParam({
    name: 'id',
    description: 'Device ID (1, 2, 3 ...).',
    required: true,
    type: Number,
    schema: { type: 'integer', default: 1 },
  })
  @ApiResponse({ status: 404, description: 'device not found.' })
  async getDeviceById(@Param('id') id: number = 1): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Provision a new device' })
  @ApiResponse({
    status: 201,
    description: 'Device successfully provisioned.',
    type: Device,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user. Please login first.',
  })
  @ApiResponse({ status: 400, description: 'Invalid device data' })
  @ApiBody({
    description: 'Payload to add a device',
    required: true,
    type: CreateDeviceDto,
    examples: {
      example: {
        summary: 'Example device',
        value: {
          code: 'DeviceX',
          make: 'MakeX',
          model: 'ModelX',
          name: 'Device X',
          color: 'black',
          year: 2023,
          image: 'https://example.com/device-x.jpg',
        },
      },
    },
  })
  async provisionDevice(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({
    summary: 'Update device information and/or provision status',
  })
  @ApiResponse({
    status: 200,
    description: 'Device successfully updated.',
    type: Device,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user. Please login first.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input: ID not found / code or name already exist / request not accepted by device gateway',
  })
  @ApiParam({
    name: 'id',
    description: 'Device ID (1, 2, 3 ...).',
    required: true,
    type: Number,
    schema: { type: 'integer', default: 1 },
  })
  @ApiBody({
    description: 'Payload to update a device',
    required: true,
    type: CreateDeviceDto,
    examples: {
      example: {
        summary: 'Example device',
        value: {
          code: 'DeviceX',
          make: 'MakeX',
          model: 'ModelX',
          name: 'Device X',
          color: 'black',
          year: 2023,
          image: 'https://example.com/device-x.jpg',
          provisionStatus: 'Active', // or 'Inactive', 'Maintenance', 'Broken'
        },
      },
    },
  })
  async updateDevice(
    @Param('id') id: number = 1,
    @Body() deviceDto: CreateDeviceDto,
  ): Promise<Device> {
    return this.devicesService.update(id, deviceDto);
  }
}
