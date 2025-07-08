import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  CommandControl,
  CommandHornCommand,
  CommandInterface,
  CommandLightsCommand,
  CommandLockCommand,
  CommandStatus,
} from './interfaces/command.interfaces';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Command implements CommandInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty()
  id: number;

  @Column({ default: 7 }) // the one we have at the moment
  @ApiProperty()
  deviceId: number;

  @Column({ default: 1 }) // to do: make it a foreign key and use it
  @ApiProperty()
  userId: number;

  @Column()
  @ApiProperty()
  control: CommandControl;

  @Column()
  @ApiProperty()
  command: CommandLockCommand | CommandHornCommand | CommandLightsCommand;

  @Column({ default: CommandStatus.PENDING })
  @ApiProperty()
  status: CommandStatus;

  @Column()
  @ApiProperty()
  timestamp: Date;
}
