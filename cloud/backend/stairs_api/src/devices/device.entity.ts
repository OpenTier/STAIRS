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
import { DeviceInterface, DeviceStatus } from './interfaces/device.interfaces';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Device implements DeviceInterface {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  code: string;

  @Column()
  @ApiProperty()
  make: string;

  @Column()
  @ApiProperty()
  model: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  color: string;

  @Column()
  @ApiProperty()
  year: number;

  @Column({ default: 'device.png' })
  @ApiProperty()
  image: string;

  @Column({ default: DeviceStatus.ACTIVE })
  @ApiProperty()
  provisionStatus: DeviceStatus;

  @Column()
  @ApiProperty()
  createdOn: Date;

  @Column()
  @ApiProperty()
  lastModifiedOn: Date;

  // To add: Link to User in the users table (when created)
}
