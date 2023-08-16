import { Nullable } from '../../shared/domain/Nullable';
import { GithubId } from './GithubId';
import { GoogleId } from './GoogleId';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';

export interface UserRepository {
  create(user: User): Promise<void>;
  findById(id: UserId): Promise<Nullable<User>>;
  findByEmail(email: UserEmail): Promise<Nullable<User>>;
  findByGoogleId(googleId: GoogleId): Promise<Nullable<User>>;
  findByGithubId(githubId: GithubId): Promise<Nullable<User>>;
  findByNickname(nickname: UserNickname): Promise<Nullable<User>>;
  update(user: User): Promise<void>;
}
