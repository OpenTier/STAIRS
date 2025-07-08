import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceInterface, DeviceStatus } from './interfaces/device.interfaces';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Device implements DeviceInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  code: string;

  @Column()
  @ApiProperty()
  make: string;

  @Column()
  @ApiProperty()
  model: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  color: string;

  @Column()
  @ApiProperty()
  year: number;

  @Column({ default: 'device.png' })
  @ApiProperty()
  image: string;

  @Column({ default: DeviceStatus.ACTIVE })
  @ApiProperty()
  provisionStatus: DeviceStatus;

  @Column()
  @ApiProperty()
  createdOn: Date;

  @Column()
  @ApiProperty()
  lastModifiedOn: Date;

  // To add: Link to User in the users table (when created)
}
