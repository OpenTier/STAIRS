import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  CommandControl,
  CommandHornCommand,
  CommandInterface,
  CommandLightsCommand,
  CommandLockCommand,
  CommandMethod,
  CommandStatus,
} from './interfaces/command.interfaces';

@Entity()
export class Command implements CommandInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: 7 }) // the one we have at the moment
  deviceId: number;

  @Column({ default: 1 }) // to do: make it a foreign key and use it
  userId: number;

  @Column({ default: CommandMethod.FLEET_MANAGEMENT_UI })
  method: CommandMethod;

  @Column()
  control: CommandControl;

  @Column()
  command: CommandLockCommand | CommandHornCommand | CommandLightsCommand;

  @Column({ default: CommandStatus.PENDING })
  status: CommandStatus;

  @Column()
  timestamp: Date;
}
