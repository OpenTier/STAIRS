import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CommandControl,
  CommandHornCommand,
  CommandLightsCommand,
  CommandLockCommand,
  CommandMethod,
} from '../interfaces/command.interfaces';

export class CreateCommandDto {
  //id: number; // set automcatically
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;
  //userId: number; // TBD later on
  @ApiProperty()
  method: CommandMethod;
  @ApiProperty()
  @IsNotEmpty()
  control: CommandControl;
  @ApiProperty()
  @IsNotEmpty()
  command: CommandLockCommand | CommandHornCommand | CommandLightsCommand;
  //status: CommandStatus; // PENDING
  //timestamp: Date; // Set by backend
}
