import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../../shared/application/CommandHandler';
import { EventBus } from '../../../../shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { User } from '../../../domain/User';
import { UserNickname } from '../../../domain/UserNickname';
import { UserRepository } from '../../../domain/UserRepository';
import { MongoUserRepository } from '../../../infrastructure/persistance/mongo/MongoUserRepository';
import { UserFinder } from '../../../domain/services/UserFinder';
import { GithubId } from '../../../domain/GithubId';
import { UserGithubCredentials } from '../../../domain/UserGithubCredentials';

export class RegisterNewUserGithubCredentialsCommand {
  public readonly githubId: number;
  public readonly name: string;
  constructor(params: { githubId: number; name: string }) {
    this.name = params.name;
    this.githubId = params.githubId;
  }
}

@Injectable({
  dependencies: [MongoUserRepository, InMemoryAsyncEventBus],
})
export class RegisterNewUserGithubCredentials extends CommandHandler<RegisterNewUserGithubCredentialsCommand> {
  private readonly userFinder: UserFinder;
  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.userFinder = new UserFinder(userRepository);
  }
  async execute(
    command: RegisterNewUserGithubCredentialsCommand
  ): Promise<void> {
    const githubId = GithubId.of(command.githubId);
    const name = UserNickname.of(command.name);

    const alreadyPersisted =
      (await this.userFinder.findByGithubId(githubId)) !== null;

    if (alreadyPersisted) {
      return;
    }

    const credentials = UserGithubCredentials.of({
      githubId,
    });

    const user = User.createNewWithGithubCredentials({
      nickname: name,
      credentials,
    });

    await this.userRepository.create(user);

    super.publishAggregateRootEvents(user);

    return;
  }
}
