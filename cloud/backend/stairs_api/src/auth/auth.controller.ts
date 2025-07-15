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

import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/sign_in.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({
    status: 200,
    description: 'User validated. Returns the JWT in access_token field',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized exception. Invalid username / password.',
  })
  @ApiBody({
    description: 'Payload to log in',
    required: true,
    type: LoginDto,
    examples: {
      admin: {
        summary: 'Admin Credentials',
        value: {
          name: 'admin',
          password: 'password',
        },
      },
    },
  })
  // It will receive the username and password in the request body,
  // and will return a JWT token if the user is authenticated.
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.name, signInDto.password);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({
    summary: 'Get the current authenticated user (token data)',
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated. Returns the user token data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user. Please login first.',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
