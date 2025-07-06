// Define common types here
export enum VehicleStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Maintenance',
  BROKEN = 'Broken',
}

export enum VehicleType {
  REAL = 0,
  SIMULATED = 1,
}

export interface VehicleInterface {
  id: number;
  type: VehicleType;
  vin: string;
  make: string;
  model: string;
  plate: string;
  color: string;
  year: number;
  image: string;
  provisionStatus: VehicleStatus;
  createdOn: Date;
  lastModifiedOn: Date;
}
