import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus, VehicleType } from '../interfaces/vehicle.interfaces';

export class CreateVehicleDto {
  @ApiProperty()
  @IsNotEmpty()
  type: VehicleType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  make: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  plate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  provisionStatus: VehicleStatus;
}
