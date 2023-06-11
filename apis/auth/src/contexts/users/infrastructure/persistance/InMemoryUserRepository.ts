import { Nullable } from '../../../shared/domain/Nullable';
import { GithubId } from '../../domain/GithubId';
import { GoogleId } from '../../domain/GoogleId';
import { User } from '../../domain/User';
import { UserEmail } from '../../domain/UserEmail';
import { UserId } from '../../domain/UserId';
import { UserNickname } from '../../domain/UserNickname';
import { UserRepository } from '../../domain/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  constructor(public readonly users: User[] = []) {}

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
  async findById(id: UserId): Promise<Nullable<User>> {
    const user = this.users.find((user) => user.id.equals(id));
    if (!user) return null;
    return user;
  }
  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    const user = this.users.find((user) => user.email.equals(email));
    if (!user) return null;
    return user;
  }
  async findByGoogleId(googleId: GoogleId): Promise<Nullable<User>> {
    const user = this.users.find(
      (user) =>
        user.credentials.type === 'GOOGLE' &&
        user.credentials.googleId.equals(googleId)
    );
    if (!user) return null;
    return user;
  }

  async findByGithubId(githubId: GithubId): Promise<Nullable<User>> {
    const user = this.users.find(
      (user) =>
        user.credentials.type === 'GITHUB' &&
        user.credentials.googleId.equals(githubId)
    );
    if (!user) return null;
    return user;
  }
  async findByNickname(nickname: UserNickname): Promise<Nullable<User>> {
    const user = this.users.find((user) => user.nickname.equals(nickname));
    if (!user) return null;
    return user;
  }
}
