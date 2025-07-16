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
