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
