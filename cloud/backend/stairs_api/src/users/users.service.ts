import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'john doe',
      email: 'john.doe@gmail.com',
      salt: 'salt',
      password: 'changeme',
      role: 'fleet_manager',
    },
    {
      id: 2,
      name: 'Karl Courier',
      email: 'karl.courier@gmail.com',
      salt: 'salt',
      password: 'guess',
      role: 'courier',
    },
  ];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // TODO: uncomment this method when the data is inside the database
  // findOne(id: number): Promise<User | null> {
  //   return this.usersRepository.findOneBy({ id });
  // }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name);
  }
}
