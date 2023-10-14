import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { Injectable } from '@studio/dependency-injection';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { MongoCourseSubscriptionRepository } from '../../infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionId } from '../../domain/CourseSubscriptionId';
import { UserId } from '../../domain/UserId';
import { CourseSubscriptionNotFoundError } from '../../domain/errors/CourseSubscriptionNotFoundError';
import { RabbitMQEventBus } from '../../../shared/infrastructure/EventBus/RabbitMQEventBus';

export class DeleteCourseSubscriptionCommand {
  public readonly id: string;
  public readonly userId: string;
  constructor(args: { id: string; userId: string }) {
    this.id = args.id;
    this.userId = args.userId;
  }
}

@Injectable({
  dependencies: [MongoCourseSubscriptionRepository, RabbitMQEventBus],
})
export class DeleteCourseSubscription extends CommandHandler<DeleteCourseSubscriptionCommand> {
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;

  constructor(
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
  }
  async execute(command: DeleteCourseSubscriptionCommand): Promise<void> {
    const courseSubscriptionId = CourseSubscriptionId.of(command.id);
    const userId = UserId.of(command.userId);

    const courseSubscription =
      await this.courseSubscriptionFinder.findByIdOrThrow(courseSubscriptionId);

    if (courseSubscription.userId.value !== userId.value) {
      throw CourseSubscriptionNotFoundError.searchedById(
        courseSubscriptionId.value
      );
    }

    courseSubscription.delete();

    await this.courseSubscriptionRepository.removeById(courseSubscriptionId);

    this.publishAggregateRootEvents(courseSubscription);

    return;
  }
}
