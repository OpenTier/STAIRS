import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Command } from './command.entity';
import { Repository } from 'typeorm';
import {
  CommandControl,
  CommandLockCommand,
  CommandStatus,
} from './interfaces/command.interfaces';
import { CreateCommandDto } from './dto/create_command.dto';
import { trace } from '@opentelemetry/api';

@Injectable()
export class CommandsService {
  constructor(
    @InjectRepository(Command)
    private readonly commandRepository: Repository<Command>,
  ) {}

  async findAll(
    deviceId: number,
    status: CommandStatus,
    control: CommandControl,
  ): Promise<Command[]> {
    return await this.commandRepository.find({
      where: { deviceId: deviceId, status, control },
    });
  }

  async create(commandDetails: CreateCommandDto): Promise<Command> {
    /* Check if there is a pending command */
    const tracer = trace.getTracer('commands-create');
    let existingCmd;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      existingCmd = await this.commandRepository.findOneBy({
        deviceId: commandDetails.deviceId,
        control: commandDetails.control,
        status: CommandStatus.PENDING,
      });
      span.end();
    });
    if (existingCmd)
      throw new BadRequestException(
        `Pending ${commandDetails.control} command for device with ID ${commandDetails.deviceId} was found`,
      );

    let newCommand;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      newCommand = this.commandRepository.create({
        ...commandDetails,
        status: CommandStatus.PENDING,
        timestamp: new Date(),
      });
      span.end();
    });

    /* Save to DB */
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      await this.commandRepository.save(newCommand);
      span.end();
    });

    /* Integrate with device GW: */
    await tracer.startActiveSpan('device-gateway-interaction', async (span) => {
      try {
        const cmdToDevice: string =
          commandDetails.command === CommandLockCommand.LOCK
            ? 'lock'
            : 'unlock';
        const deviceGwUrl: string = `${process.env.DEVICE_GW}/device/${commandDetails.deviceId}/${cmdToDevice}`;

        const response = await fetch(deviceGwUrl, {
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
        console.error(
          'Error sending command to device gateway:',
          error.message,
        );
      }
      span.end();
    });

    let ret;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      ret = await this.commandRepository.save(newCommand);
      span.end();
    });
    return ret;
  }
}
