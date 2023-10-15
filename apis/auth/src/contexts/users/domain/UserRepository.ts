import { Nullable } from '../../shared/domain/Nullable';
import { GithubId } from './GithubId';
import { GoogleId } from './GoogleId';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: UserId): Promise<Nullable<User>>;
  abstract findByEmail(email: UserEmail): Promise<Nullable<User>>;
  abstract findByGoogleId(googleId: GoogleId): Promise<Nullable<User>>;
  abstract findByGithubId(githubId: GithubId): Promise<Nullable<User>>;
  abstract findByNickname(nickname: UserNickname): Promise<Nullable<User>>;
  abstract update(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
