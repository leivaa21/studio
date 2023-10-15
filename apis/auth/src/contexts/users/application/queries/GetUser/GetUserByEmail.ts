import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../../shared/application/QueryHandler';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserRepository } from '../../../domain/UserRepository';

export class GetUserByEmailQuery {
  public readonly email: string;
  constructor(params: { email: string }) {
    this.email = params.email;
  }
}

@Injectable({
  dependencies: [UserRepository],
})
export class GetUserByEmailHandler
  implements QueryHandler<GetUserByEmailQuery, User>
{
  private readonly userFinder: UserFinder;
  constructor(userRepository: UserRepository) {
    this.userFinder = new UserFinder(userRepository);
  }

  async execute(query: GetUserByEmailQuery): Promise<User> {
    const email = UserEmail.of(query.email);

    return this.userFinder.findByEmailOrThrow(email);
  }
}
