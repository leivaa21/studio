import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { UserRepository } from '../../domain/UserRepository';
import { MongoUserRepository } from '../../infrastructure/persistance/mongo/MongoUserRepository';
import { UserFinder } from '../../domain/services/UserFinder';
import { UserId } from '../../domain/UserId';
import { UserEmail } from '../../domain/UserEmail';
import { UnableToChangeEmail } from '../../domain/errors/UnableToChangeEmail';

export class ChangeEmailCommand {
  public readonly userId: string;
  public readonly email: string;
  constructor(params: { email: string; userId: string }) {
    this.userId = params.userId;
    this.email = params.email;
  }
}

@Injectable({
  dependencies: [MongoUserRepository, InMemoryAsyncEventBus],
})
export class ChangeEmail extends CommandHandler<ChangeEmailCommand> {
  private readonly userFinder: UserFinder;
  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.userFinder = new UserFinder(userRepository);
  }
  async execute(command: ChangeEmailCommand): Promise<void> {
    const userId = UserId.of(command.userId);

    const user = await this.userFinder.findByIdOrThrow(userId);

    if (!user.canChangeEmail) {
      throw UnableToChangeEmail.causeHasWrongCredentialType(
        user.id.value,
        user.credentials.type
      );
    }

    const email = UserEmail.of(command.email);

    user.changeEmail(email);

    await this.userRepository.update(user);

    super.publishAggregateRootEvents(user);
  }
}
