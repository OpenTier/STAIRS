import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  VehicleInterface,
  VehicleStatus,
  VehicleType,
} from './interfaces/vehicle.interfaces';

@Entity()
export class Vehicle implements VehicleInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: VehicleType.SIMULATED })
  type: VehicleType;

  @Column({ unique: true })
  vin: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ unique: true })
  plate: string;

  @Column()
  color: string;

  @Column()
  year: number;

  @Column({ default: 'One-1-1.png' })
  image: string;

  @Column({ default: VehicleStatus.ACTIVE })
  provisionStatus: VehicleStatus;

  @Column()
  createdOn: Date;

  @Column()
  lastModifiedOn: Date;

  // To add: Link to Courier in the users table (when created)
}
