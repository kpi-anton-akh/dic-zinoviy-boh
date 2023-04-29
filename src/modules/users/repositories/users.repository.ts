import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos/index';
import { UserEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async get(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }
}
