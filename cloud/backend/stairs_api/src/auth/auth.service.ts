import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

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
    const user = await this.usersService.findOne(name);
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
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
