import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Command } from './command.entity';
import { Repository } from 'typeorm';
import {
  CommandControl,
  CommandLockCommand,
  CommandStatus,
} from './interfaces/command.interfaces';
import { UpdateCommandDto } from './dto/update_command.dto';
import { CreateCommandDto } from './dto/create_command.dto';

@Injectable()
export class CommandsService {
  constructor(
    @InjectRepository(Command)
    private readonly commandRepository: Repository<Command>,
  ) {}

  async findAll(
    vehicleId: number,
    status: CommandStatus,
    control: CommandControl,
  ): Promise<Command[]> {
    return await this.commandRepository.find({
      where: { vehicleId, status, control },
    });
  }

  async update(
    id: number,
    updateCommandDto: UpdateCommandDto,
  ): Promise<Command> {
    const newCmd = await this.commandRepository.findOneBy({
      id,
      status: CommandStatus.PENDING,
    });
    if (!newCmd)
      throw new BadRequestException(
        `Command ID ${id} not found or is not pending`,
      );
    newCmd.status = updateCommandDto.status;
    newCmd.timestamp = new Date();
    return await this.commandRepository.save(newCmd);
  }

  async create(commandDetails: CreateCommandDto): Promise<Command> {
    /* Check if there is a pending command */
    const existingCmd = await this.commandRepository.findOneBy({
      vehicleId: commandDetails.vehicleId,
      control: commandDetails.control,
      status: CommandStatus.PENDING,
    });
    if (existingCmd)
      throw new BadRequestException(
        `Pending ${commandDetails.control} command for vehicle with ID ${commandDetails.vehicleId} was found`,
      );

    const newCommand = this.commandRepository.create({
      ...commandDetails,
      status: CommandStatus.PENDING,
      timestamp: new Date(),
    });

    /* Save to DB */
    await this.commandRepository.save(newCommand);

    /* Integrate with vehicle GW: */
    try {
      const cmdToVehicle: string =
        commandDetails.command === CommandLockCommand.LOCK ? 'lock' : 'unlock';
      const vehicleGwUrl: string = `${process.env.VEHICLE_GW}/vehicle/${commandDetails.vehicleId}/${cmdToVehicle}`;

      const response = await fetch(vehicleGwUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // TODO: there is no command id right now
        // body: JSON.stringify({
        //   command_id: newCommand.id
        // }),
      });

      console.debug(await response.json());

      if (!response.ok) {
        // Issue in command => should not keep it pending
        newCommand.status = CommandStatus.REJECTED;
      } else {
        // Accepting the command currently means it is done
        newCommand.status = CommandStatus.DONE;
      }
    } catch (error) {
      // Issue in command => should not keep it pending
      newCommand.status = CommandStatus.REJECTED;
      console.error('Error sending command to vehicle gateway:', error.message);
    }

    return await this.commandRepository.save(newCommand);
  }
}
