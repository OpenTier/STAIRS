// Copyright (c) 2025 by OpenTier GmbH
// SPDX‑FileCopyrightText: 2025 OpenTier GmbH
// SPDX‑License‑Identifier: MIT

// This file is part of OpenTier.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
