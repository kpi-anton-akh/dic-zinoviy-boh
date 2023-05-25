import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { UserStatsPublisher } from '../../shared/service-bus/UserStatsPublisher';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly userStatsPublisher: UserStatsPublisher,
  ) {}

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

    const createdUser = await this.usersRepository.create(user);

    await this.userStatsPublisher.publish(createdUser.id);

    return createdUser;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    return this.usersRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
