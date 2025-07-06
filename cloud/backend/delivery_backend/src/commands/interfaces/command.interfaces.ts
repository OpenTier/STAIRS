// Define common types here
export interface CommandInterface {
  id: number;
  vehicleId: number;
  userId: number;
  method: CommandMethod;
  control: CommandControl;
  command: CommandLockCommand | CommandHornCommand | CommandLightsCommand;
  status: CommandStatus;
  timestamp: Date;
}

export enum CommandMethod {
  FLEET_MANAGEMENT_UI = 0,
  COURIER_APP = 1,
}

export enum CommandControl {
  LOCKING = 'Lock',
  HORN = 'Horn',
  LIGHTS = 'Lights',
}

export enum CommandLockCommand {
  LOCK = 'Lock',
  UNLOCK = 'Unlock',
}

export enum CommandHornCommand {
  BEEP = 'Beep',
  DOUBLE_BEEP = 'DoubleBeep',
}

export enum CommandLightsCommand {
  LIGHTS_ON = 'On',
  LIGHTS_OFF = 'Off',
  LIGHTS_BLINK = 'Blink',
}

export enum CommandStatus {
  PENDING = 'Pending',
  DONE = 'Done',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}
