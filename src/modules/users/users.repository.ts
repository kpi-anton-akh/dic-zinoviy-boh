import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUsersRepository } from './interfaces/index';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { POSTGRES_CONNECTION_NAME } from '../../shared/constants/index';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User, POSTGRES_CONNECTION_NAME)
    private usersRepository: Repository<User>,
  ) {}

  async get(id: number): Promise<User> {
    const userFromDB = await this.usersRepository.findOneBy({ id });
    const user = plainToClass(User, userFromDB);

    return user;
  }

  async getAll(): Promise<User[]> {
    const usersFromDB = await this.usersRepository.find();
    const users = usersFromDB.map((user) => plainToClass(User, user));

    return users;
  }

  async create(userToCreate: Partial<User>): Promise<User> {
    const userFromDB = this.usersRepository.create(userToCreate);
    const savedUser = await this.usersRepository.save(userFromDB);
    const createdUser = plainToClass(User, savedUser);

    return createdUser;
  }

  async update(id: number, userToUpdate: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userToUpdate);
    const userFromDB = await this.usersRepository.findOneBy({ id });
    const updatedUser = plainToClass(User, userFromDB);

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getByEmail(email: string): Promise<User> {
    const userFromDB = await this.usersRepository.findOneBy({ email });
    const user = plainToClass(User, userFromDB);

    return user;
  }
}
