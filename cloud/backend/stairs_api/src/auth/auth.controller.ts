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
  getProfile(@Request() req) {
    return req.user;
  }
}
