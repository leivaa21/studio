import { Nullable } from '../../shared/domain/Nullable';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';

export interface UserRepository {
  create(user: User): Promise<void>;
  findById(id: UserId): Promise<Nullable<User>>;
  findByEmail(email: UserEmail): Promise<Nullable<User>>;
  findByNickname(nickname: UserNickname): Promise<Nullable<User>>;
}
