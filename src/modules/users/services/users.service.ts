import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/users.entity';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto, UpdateUserDto } from '../dtos';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getAll(): Promise<UserEntity[]> {
    return this.usersRepository.getAll();
  }

  async get(id: number): Promise<UserEntity> {
    return this.usersRepository.get(id);
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const userInDB = await this.usersRepository.getByEmail(user.email);

    if (userInDB)
      throw new ConflictException(
        `User with the email "${user.email}" already exists!`,
      );

    return this.usersRepository.create(user);
  }

  async update(id: number, user: UpdateUserDto): Promise<UserEntity> {
    return this.usersRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
