import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async get(id: number): Promise<UserEntity> {
    const userFromDB = await this.usersRepository.findOneBy({ id });
    const user = plainToClass(UserEntity, userFromDB);

    return user;
  }

  async getAll(): Promise<UserEntity[]> {
    const usersFromDB = await this.usersRepository.find();
    const users = usersFromDB.map((user) => plainToClass(UserEntity, user));

    return users;
  }

  async create(userToCreate: Partial<UserEntity>): Promise<UserEntity> {
    const userFromDB = this.usersRepository.create(userToCreate);
    const savedUser = await this.usersRepository.save(userFromDB);
    const createdUser = plainToClass(UserEntity, savedUser);

    return createdUser;
  }

  async update(
    id: number,
    userToUpdate: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.usersRepository.update(id, userToUpdate);
    const userFromDB = await this.usersRepository.findOneBy({ id });
    const updatedUser = plainToClass(UserEntity, userFromDB);

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const userFromDB = await this.usersRepository.findOneBy({ email });
    const user = plainToClass(UserEntity, userFromDB);

    return user;
  }
}
