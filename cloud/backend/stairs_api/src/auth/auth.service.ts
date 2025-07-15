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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { trace } from '@opentelemetry/api';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    name: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const tracer = trace.getTracer('auth-login');
    let user;
    await tracer.startActiveSpan('device-db-operation', async (span) => {
      user = await this.usersService.findOne(name);
      span.end();
    });

    /* Of course in a real application, you wouldn't store a password
    in plain text. You'd instead use a library like bcrypt,
    with a salted one-way hash algorithm.
    With that approach, you'd only store hashed passwords,
    and then compare the stored password to a hashed version
    of the incoming password, thus never storing or exposing user passwords
    in plain text.
    To keep our sample app simple, we violate that absolute mandate and
    use plain text. Don't do this in your real app! */
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { name: user.name, sub: user.id };
    let token;
    await tracer.startActiveSpan('token-sign', async (span) => {
      token = await this.jwtService.signAsync(payload);
      span.end();
    });
    return {
      access_token: token,
    };
  }
}
