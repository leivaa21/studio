import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../../shared/application/QueryHandler';
import { CommandBus } from '../../../../shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../shared/infrastructure/CommandBus/InMemoryCommandBus';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserRepository } from '../../../domain/UserRepository';
import { MongoUserRepository } from '../../../infrastructure/persistance/mongo/MongoUserRepository';
import { InvalidCredentialsError } from '../../../domain/errors/InvalidCredentials';
import { GithubId } from '../../../domain/GithubId';
import { UserNickname } from '../../../domain/UserNickname';
import { RegisterNewUserGithubCredentialsCommand } from '../../commands/RegisterNewUser/RegisterNewUserGithubCredentials';

export class SignInWithGithubCredentialsQuery {
  public readonly githubId: number;
  public readonly name: string;
  constructor(params: { githubId: number; name: string }) {
    this.githubId = params.githubId;
    this.name = params.name;
  }
}

@Injectable({
  dependencies: [InMemoryCommandBus, MongoUserRepository],
})
export class SignInWithGithubCredentialsHandler
  implements QueryHandler<SignInWithGithubCredentialsQuery, User>
{
  private readonly userFinder: UserFinder;
  constructor(
    private readonly commandBus: CommandBus,
    userRepository: UserRepository
  ) {
    this.userFinder = new UserFinder(userRepository);
  }

  async execute(query: SignInWithGithubCredentialsQuery): Promise<User> {
    const name = UserNickname.of(query.name);
    const githubId = GithubId.of(query.githubId);

    let user = await this.userFinder.findByGithubId(githubId);

    if (!user) {
      await this.createNonExistingUser(githubId, name);
      user = await this.userFinder.findByGithubIdOrThrow(githubId);
    }

    if (!user.doGithubCredentialMatch({ githubId })) {
      throw InvalidCredentialsError.causeGoogleCredentialsDoNotMatch();
    }

    return user;
  }

  private async createNonExistingUser(githubId: GithubId, name: UserNickname) {
    return this.commandBus.dispatch<RegisterNewUserGithubCredentialsCommand>(
      new RegisterNewUserGithubCredentialsCommand({
        githubId: githubId.value,
        name: name.value,
      })
    );
  }
}
