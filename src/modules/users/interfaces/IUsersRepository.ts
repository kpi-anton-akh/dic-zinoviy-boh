import { User } from '../user.entity';

export interface IUsersRepository {
  getAll(): Promise<User[]>;
  get(id: number): Promise<User>;
  create(user: Partial<User>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  getByEmail(name: string): Promise<User>;
}
