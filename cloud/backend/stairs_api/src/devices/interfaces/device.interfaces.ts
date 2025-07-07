// Define common types here
export enum DeviceStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Maintenance',
  BROKEN = 'Broken',
}

export interface DeviceInterface {
  id: number;
  deviceId: string;
  make: string;
  model: string;
  name: string;
  color: string;
  year: number;
  image: string;
  provisionStatus: DeviceStatus;
  createdOn: Date;
  lastModifiedOn: Date;
}
