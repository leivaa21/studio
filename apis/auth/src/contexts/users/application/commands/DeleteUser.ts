import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { UserRepository } from '../../domain/UserRepository';
import { UserFinder } from '../../domain/services/UserFinder';
import { UserId } from '../../domain/UserId';

export class DeleteUserCommand {
  public readonly userId: string;
  constructor(params: { userId: string }) {
    this.userId = params.userId;
  }
}

@Injectable({
  dependencies: [UserRepository, EventBus],
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
