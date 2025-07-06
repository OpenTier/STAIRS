import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandsService } from './commands.service';
import { Command } from './command.entity';
import { CommandControl, CommandStatus } from './interfaces/command.interfaces';
import { UpdateCommandDto } from './dto/update_command.dto';
import { CreateCommandDto } from './dto/create_command.dto';

@ApiBearerAuth()
@ApiTags('fleet_management', 'commands')
@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all commands' })
  @ApiResponse({ status: 200, description: 'Return all commands.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllVehicles(
    @Query('vehicleId', ParseIntPipe) vehicleId: number = 7,
    @Query('status') status: CommandStatus,
    @Query('control') control: CommandControl,
  ): Promise<Command[]> {
    return this.commandsService.findAll(vehicleId, status, control);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update command status' })
  @ApiResponse({ status: 200, description: 'Command status is updated' })
  @ApiResponse({ status: 400, description: 'Invalid Target Cycle.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateCommandStatus(
    @Param('id') commandId: number,
    @Body() updateCommandDto: UpdateCommandDto,
  ): Promise<Command> {
    return this.commandsService.update(commandId, updateCommandDto);
  }

  @Post()
  @ApiOperation({ summary: 'Issue new command' })
  @ApiResponse({ status: 200, description: 'Command is added' })
  @ApiResponse({
    status: 400,
    description:
      'Already ongoing command with same command control for the same vehicle',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  addCommand(@Body() createCommandDto: CreateCommandDto): Promise<Command> {
    return this.commandsService.create(createCommandDto);
  }
}
