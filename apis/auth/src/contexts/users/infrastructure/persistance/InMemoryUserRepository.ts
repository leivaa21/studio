import { User } from '../../domain/User';
import { UserEmail } from '../../domain/UserEmail';
import { UserId } from '../../domain/UserId';
import { UserNickname } from '../../domain/UserNickname';
import { UserRepository } from '../../domain/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly users: User[] = []) {}

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
  async findById(id: UserId): Promise<User | undefined> {
    return this.users.find((user) => user.id.equals(id));
  }
  async findByEmail(email: UserEmail): Promise<User | undefined> {
    return this.users.find((user) => user.email.equals(email));
  }
  async findByNickname(nickname: UserNickname): Promise<User | undefined> {
    return this.users.find((user) => user.nickname.equals(nickname));
  }
}
