import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../../shared/application/QueryHandler';
import { InvalidCredentialsError } from '../../../domain/errors/InvalidCredentials';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserRepository } from '../../../domain/UserRepository';

export class SignInWithBasicCredentialsQuery {
  public readonly email: string;
  public readonly password: string;
  constructor(params: { email: string; password: string }) {
    this.email = params.email;
    this.password = params.password;
  }
}

@Injectable({
  dependencies: [UserRepository],
})
export class SignInWithBasicCredentialsHandler
  implements QueryHandler<SignInWithBasicCredentialsQuery, User>
{
  private readonly userFinder: UserFinder;
  constructor(userRepository: UserRepository) {
    this.userFinder = new UserFinder(userRepository);
  }

  async execute(query: SignInWithBasicCredentialsQuery): Promise<User> {
    const email = UserEmail.of(query.email);

    const user = await this.userFinder.findByEmailOrNull(email);

    if (!user || !user.doBasicCredentialMatch(query.email, query.password)) {
      throw InvalidCredentialsError.causeBasicCredentialsDoNotMatch();
    }

    return user;
  }
}
