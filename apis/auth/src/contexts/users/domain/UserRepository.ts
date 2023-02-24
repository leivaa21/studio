import { User } from './User';
import { UserId } from './UserId';

export interface UserRepository {
  create(user: User): Promise<void>;
  findById(id: UserId): Promise<User | undefined>;
}
