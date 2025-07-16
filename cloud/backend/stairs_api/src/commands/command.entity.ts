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
