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

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create_device.dto';
import { DeviceStatus } from './interfaces/device.interfaces';
import seedDevices from './data/device.seed';
import { trace } from '@opentelemetry/api';

@Injectable()
export class DevicesService implements OnModuleInit {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  /// New: onModuleInit() automatically runs at module startup
  async onModuleInit() {
    await this.fillDBIfEmpty();
  }
  private async fillDBIfEmpty() {
    // 1) Check if “devices” table is empty
    const count = await this.deviceRepository.count();
    if (count > 0) {
      console.log(`Device table not empty (count=${count}), skipping seeding.`);
      return;
    }

    console.log('Device table is empty — seeding initial data…');
    // Keep fetching the health API of the device gateway till it returns OK or timeout of 20 retries
    const deviceGwUrl = `${process.env.DEVICE_GW}/health`;
    let remainingRetries = 20;
    while (remainingRetries > 0) {
      try {
        const response = await fetch(deviceGwUrl);
        if (response.ok) {
          console.debug('Device gateway is ready.');
          break;
        }
      } catch {
        console.debug('Device gateway is not ready yet, retrying...');
      }
      remainingRetries--;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }

    // 2) Use hardcoded seed data
    const rows = seedDevices;

    // 3) Loop over each item and reuse create()
    for (const entry of rows) {
      try {
        await this.create({
          code: entry.code,
          make: entry.make,
          model: entry.model,
          name: entry.name,
          color: entry.color,
          year: entry.year,
          image: entry.image,
          provisionStatus: entry.provisionStatus,
        });
        console.log(`Seeded device with code = ${entry.code}`);
      } catch (e) {
        console.error(
          `Failed to seed device with code = ${entry.code}: ${e.message}`,
        );
      }
    }

    console.log('Seeding of devices complete.');
  }

  async findAll(): Promise<Device[]> {
    return await this.deviceRepository.find({
      order: {
        id: 'ASC', // To have the device with the largest ID at the end
      },
    });
  }

  async findOne(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const tracer = trace.getTracer('device-create');
    // Create the object from the received data
    let device;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      device = this.deviceRepository.create({
        ...createDeviceDto,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
      });
      span.end();
    });

    // Data validation
    let existingDeviceCode;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      existingDeviceCode = await this.deviceRepository.findOne({
        where: {
          code: createDeviceDto.code,
        },
      });
      span.end();
    });
    if (existingDeviceCode) {
      throw new BadRequestException(
        `Device with code ${createDeviceDto.code} already exists`,
      );
    }
    let existingName;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      existingName = await this.deviceRepository.findOne({
        where: { name: createDeviceDto.name },
      });
      span.end();
    });
    if (existingName) {
      throw new BadRequestException(
        `Device with name ${createDeviceDto.name} already exists`,
      );
    }

    // Save to the database
    try {
      await tracer.startActiveSpan('device-db-operation', async (span) => {
        await this.deviceRepository.save(device);
        span.end();
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    // Post to the device gateway
    try {
      const deviceGwUrl = `${process.env.DEVICE_GW}/device`;
      let response;
      await tracer.startActiveSpan(
        'device-gateway-interaction',
        async (span) => {
          response = await fetch(deviceGwUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              entity_id: device.id.toString(),
              entity_code: createDeviceDto.code,
            }),
          });
          console.debug(await response.json());
          span.end();
        },
      );

      if (!response.ok) {
        // Remove from DB to keep consistency
        await tracer.startActiveSpan('device-db-operation', async (span) => {
          await this.deviceRepository.delete(device.id);
          span.end();
        });
        throw new BadRequestException(`Request was rejected by device gateway`);
      }
    } catch (error) {
      console.error('Exception while calling device gateway', {
        message: error.message,
        stack: error.stack,
        cause: error.cause ?? undefined,
      });
      await tracer.startActiveSpan('device-db-operation', async (span) => {
        await this.deviceRepository.delete(device.id);
        span.end();
      });
      throw new BadRequestException(
        'Error sending command to device gateway:',
        error.message,
      );
    }
    // Save to the database
    let result;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      result = await this.deviceRepository.save(device);
      span.end();
    });
    return result;
  }

  async update(id: number, deviceDto: CreateDeviceDto): Promise<Device> {
    const tracer = trace.getTracer('device-update');
    // 1) Find the device
    let device;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      device = await this.deviceRepository.findOne({ where: { id } });
      span.end();
    });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    // 2) Data validation (to have meaningful error messages instead of DB exceptions)
    let existingDeviceCode;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      existingDeviceCode = await this.deviceRepository.findOne({
        where: { code: deviceDto.code },
      });
      span.end();
    });
    if (existingDeviceCode && existingDeviceCode.id !== id) {
      throw new BadRequestException(
        `Device with code ${deviceDto.code} already exists`,
      );
    }
    let existingName;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      existingName = await this.deviceRepository.findOne({
        where: { name: deviceDto.name },
      });
      span.end();
    });
    if (existingName && existingName.id !== id) {
      throw new BadRequestException(
        `Device with name ${deviceDto.name} already exists`,
      );
    }

    // 3) Update its status at the gateway if needed
    if (device.provisionStatus != deviceDto.provisionStatus) {
      try {
        const endpoint =
          deviceDto.provisionStatus === DeviceStatus.ACTIVE
            ? 'activate'
            : 'deactivate';
        const deviceGwUrl = `${process.env.DEVICE_GW}/device/${device.id}/${endpoint}`;

        let response;
        await tracer.startActiveSpan(
          'device-gateway-interaction',
          async (span) => {
            response = await fetch(deviceGwUrl, { method: 'POST' });
            console.debug(await response.json());
            span.end();
          },
        );

        if (!response.ok) {
          throw new BadRequestException(
            `Request was rejected by device gateway`,
          );
        }
      } catch (error) {
        console.error(error);
        throw new BadRequestException(
          'Error sending command to device gateway:',
          error.message,
        );
      }
    }

    device = {
      ...device,
      ...deviceDto,
      lastModifiedOn: new Date(),
    };
    try {
      let result;
      await tracer.startActiveSpan('device-db-operation', async (span) => {
        result = await this.deviceRepository.save(device);
        span.end();
      });
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
