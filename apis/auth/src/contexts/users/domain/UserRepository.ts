import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';

export interface UserRepository {
  create(user: User): Promise<void>;
  findById(id: UserId): Promise<User | undefined>;
  findByEmail(email: UserEmail): Promise<User | undefined>;
  findByNickname(nickname: UserNickname): Promise<User | undefined>;
}
