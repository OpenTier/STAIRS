import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommandStatus } from '../interfaces/command.interfaces';

export class UpdateCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  status: CommandStatus;
}
