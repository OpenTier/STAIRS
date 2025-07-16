// Copyright (c) 2025 by OpenTier GmbH
// SPDX‑FileCopyrightText: 2025 OpenTier GmbH
// SPDX‑License‑Identifier: MIT
//
// This file is part of OpenTier.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
