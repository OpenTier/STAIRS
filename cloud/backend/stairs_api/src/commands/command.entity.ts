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

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  CommandControl,
  CommandHornCommand,
  CommandInterface,
  CommandLightsCommand,
  CommandLockCommand,
  CommandStatus,
} from './interfaces/command.interfaces';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Command implements CommandInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty()
  id: number;

  @Column({ default: 7 }) // the one we have at the moment
  @ApiProperty()
  deviceId: number;

  @Column({ default: 1 }) // to do: make it a foreign key and use it
  @ApiProperty()
  userId: number;

  @Column()
  @ApiProperty()
  control: CommandControl;

  @Column()
  @ApiProperty()
  command: CommandLockCommand | CommandHornCommand | CommandLightsCommand;

  @Column({ default: CommandStatus.PENDING })
  @ApiProperty()
  status: CommandStatus;

  @Column()
  @ApiProperty()
  timestamp: Date;
}
