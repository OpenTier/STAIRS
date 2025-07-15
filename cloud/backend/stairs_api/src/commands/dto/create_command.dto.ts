// Copyright (c) 2025 by OpenTier GmbH
// SPDX-FileCopyrightText: 2025 OpenTier GmbH
// SPDX-License-Identifier: LGPL-3.0-or-later
//
// This file is part of OpenTier.
//
// This is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 3 of the
// License, or (at your option) any later version.
//
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this file.  If not, see <https://www.gnu.org/licenses/>.

import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CommandControl,
  CommandHornCommand,
  CommandLightsCommand,
  CommandLockCommand,
} from '../interfaces/command.interfaces';

export class CreateCommandDto {
  //id: number; // set automcatically
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  deviceId: number;
  @ApiProperty()
  @IsNotEmpty()
  control: CommandControl;
  @ApiProperty()
  @IsNotEmpty()
  command: CommandLockCommand | CommandHornCommand | CommandLightsCommand;
  //status: CommandStatus; // PENDING
  //timestamp: Date; // Set by backend
}
