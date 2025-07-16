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
