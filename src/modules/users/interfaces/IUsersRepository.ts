import { UserEntity } from '../users.entity';

export interface IUsersRepository {
  getAll(): Promise<UserEntity[]>;
  get(id: number): Promise<UserEntity>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: number, user: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: number): Promise<void>;
  getByEmail(name: string): Promise<UserEntity>;
}
