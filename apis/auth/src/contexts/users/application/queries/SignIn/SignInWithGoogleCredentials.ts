import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../../shared/application/QueryHandler';
import { CommandBus } from '../../../../shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../shared/infrastructure/CommandBus/InMemoryCommandBus';
import { GoogleId } from '../../../domain/GoogleId';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserRepository } from '../../../domain/UserRepository';
import { MongoUserRepository } from '../../../infrastructure/persistance/mongo/MongoUserRepository';
import { RegisterNewUserGoogleCredentialsCommand } from '../../commands/RegisterNewUser/RegisterNewUserGoogleCredentials';

export class SignInWithGoogleCredentialsQuery {
  public readonly googleId: string;
  public readonly email: string;
  constructor(params: { googleId: string; email: string }) {
    this.email = params.email;
    this.googleId = params.googleId;
  }
}

@Injectable({
  dependencies: [InMemoryCommandBus, MongoUserRepository],
})
export class SignInWithGoogleCredentialsHandler
  implements QueryHandler<SignInWithGoogleCredentialsQuery, User>
{
  private readonly userFinder: UserFinder;
  constructor(
    private readonly commandBus: CommandBus,
    userRepository: UserRepository
  ) {
    this.userFinder = new UserFinder(userRepository);
  }

  async execute(query: SignInWithGoogleCredentialsQuery): Promise<User> {
    const email = UserEmail.of(query.email);
    const googleId = GoogleId.of(query.googleId);

    let user = await this.userFinder.findByGoogleId(googleId);

    if (!user) {
      await this.createNonExistingUser(googleId, email);
      user = await this.userFinder.findByGoogleIdOrThrow(googleId);
    }

    return user;
  }

  private async createNonExistingUser(googleId: GoogleId, email: UserEmail) {
    return this.commandBus.dispatch<RegisterNewUserGoogleCredentialsCommand>(
      new RegisterNewUserGoogleCredentialsCommand({
        googleId: googleId.value,
        email: email.value,
      })
    );
  }
}
