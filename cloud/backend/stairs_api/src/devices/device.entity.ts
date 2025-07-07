import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceInterface, DeviceStatus } from './interfaces/device.interfaces';

@Entity()
export class Device implements DeviceInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @Column()
  year: number;

  @Column({ default: 'One-1-1.png' })
  image: string;

  @Column({ default: DeviceStatus.ACTIVE })
  provisionStatus: DeviceStatus;

  @Column()
  createdOn: Date;

  @Column()
  lastModifiedOn: Date;

  // To add: Link to Courier in the users table (when created)
}
