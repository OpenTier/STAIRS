import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandsService } from './commands.service';
import { Command } from './command.entity';
import { CommandControl, CommandStatus } from './interfaces/command.interfaces';
import { CreateCommandDto } from './dto/create_command.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('commands')
@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all commands' })
  @ApiResponse({
    status: 200,
    description: 'Return all commands',
    type: [Command],
  })
  @ApiQuery({
    name: 'deviceId',
    description: 'Device ID (1, 2, 3 ...). Default: 1',
    required: false,
    type: Number,
    schema: { type: 'integer', default: 1 },
  })
  @ApiQuery({
    name: 'status',
    description: 'Status to filter commands. Default: Done',
    required: false,
    type: String,
    schema: {
      type: 'string',
      default: 'Done',
      enum: ['Done', 'Pending', 'Rejected', 'Cancelled'],
    },
  })
  @ApiQuery({
    name: 'control',
    description: 'Control to filter commands. Default: Lock',
    required: false,
    type: String,
    schema: {
      type: 'string',
      default: 'Lock',
      enum: ['Lock', 'Horn', 'Lights'],
    },
  })
  getAllDevices(
    @Query('deviceId') deviceId: number = 1,
    @Query('status') status: CommandStatus = CommandStatus.PENDING,
    @Query('control') control: CommandControl = CommandControl.LOCKING,
  ): Promise<Command[]> {
    return this.commandsService.findAll(deviceId, status, control);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Issue new command' })
  @ApiResponse({
    status: 201,
    description: 'Command is added',
    type: Command,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user. Please login first.',
  })
  @ApiResponse({
    status: 400,
    description: 'Pending command for the same device already exists',
  })
  @ApiBody({
    description: 'Payload to create a new command',
    required: true,
    type: CreateCommandDto,
    examples: {
      lock: {
        summary: 'Lock command',
        value: {
          deviceId: 1,
          control: 'Lock',
          command: 'Lock',
        },
      },
      unlock: {
        summary: 'Unlock command',
        value: {
          deviceId: 1,
          control: 'Lock',
          command: 'Unlock',
        },
      },
    },
  })
  addCommand(@Body() createCommandDto: CreateCommandDto): Promise<Command> {
    return this.commandsService.create(createCommandDto);
  }
}
