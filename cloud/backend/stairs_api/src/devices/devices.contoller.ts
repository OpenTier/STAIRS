import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create_device.dto';

@ApiBearerAuth()
@ApiTags('fleet_management', 'devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({ status: 200, description: 'Return all devices.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllDevices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a device by ID' })
  @ApiResponse({ status: 200, description: 'Return the device.' })
  @ApiResponse({ status: 404, description: 'device not found.' })
  async getDeviceById(@Param('id') id: number): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision a new device' })
  @ApiResponse({
    status: 201,
    description: 'Device successfully provisioned.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async provisionDevice(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update device information and/or provision status',
  })
  @ApiResponse({
    status: 200,
    description: 'Device successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async updateDevice(
    @Param('id') id: number,
    @Body() deviceDto: CreateDeviceDto,
  ): Promise<Device> {
    return this.devicesService.update(id, deviceDto);
  }

  @Delete('deprovision/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deprovision an existing device' })
  @ApiResponse({
    status: 204,
    description: 'Device successfully deprovisioned.',
  })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  async deprovisionDevice(@Param('id') id: number): Promise<void> {
    return this.devicesService.remove(id);
  }
}
