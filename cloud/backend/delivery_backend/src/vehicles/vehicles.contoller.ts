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
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create_vehicle.dto';

@ApiBearerAuth()
@ApiTags('fleet_management', 'vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'Return all vehicles.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllVehicles(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Return the vehicle.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  async getVehicleById(@Param('id') id: number): Promise<Vehicle> {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle successfully provisioned.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async provisionVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update vehicle information and/or provision status',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async updateVehicle(
    @Param('id') id: number,
    @Body() vehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, vehicleDto);
  }

  @Delete('deprovision/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deprovision an existing vehicle' })
  @ApiResponse({
    status: 204,
    description: 'Vehicle successfully deprovisioned.',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  async deprovisionVehicle(@Param('id') id: number): Promise<void> {
    return this.vehiclesService.remove(id);
  }
}
