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
