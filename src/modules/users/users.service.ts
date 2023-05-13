import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }

  async get(id: number): Promise<User> {
    return this.usersRepository.get(id);
  }

  async create(user: Partial<User>): Promise<User> {
    const userInDB = await this.usersRepository.getByEmail(user.email);

    if (userInDB)
      throw new ConflictException(
        `User with the email "${user.email}" already exists!`,
      );

    return this.usersRepository.create(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    return this.usersRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
