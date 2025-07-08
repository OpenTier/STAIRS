import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TelemetryEntryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  _time: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _field: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _measurement: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  _value: number;
}
