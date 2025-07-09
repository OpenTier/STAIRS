import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'admin',
      email: 'admin@admin.com',
      salt: 'salt',
      password: 'password',
      role: 'admin',
    },
  ];

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name);
  }
}
