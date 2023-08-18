import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { UserRepository } from '../../domain/UserRepository';
import { MongoUserRepository } from '../../infrastructure/persistance/mongo/MongoUserRepository';
import { UserFinder } from '../../domain/services/UserFinder';
import { UserId } from '../../domain/UserId';

export class DeleteUserCommand {
  public readonly userId: string;
  constructor(params: { userId: string }) {
    this.userId = params.userId;
  }
}

@Injectable({
  dependencies: [MongoUserRepository, InMemoryAsyncEventBus],
})
export class DeleteUser extends CommandHandler<DeleteUserCommand> {
  private readonly userFinder: UserFinder;
  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.userFinder = new UserFinder(userRepository);
  }
  async execute(command: DeleteUserCommand): Promise<void> {
    const userId = UserId.of(command.userId);

    const user = await this.userFinder.findByIdOrThrow(userId);

    user.delete();

    await this.userRepository.delete(user);

    super.publishAggregateRootEvents(user);
  }
}
