import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { Injectable } from '@studio/dependency-injection';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { MongoCourseSubscriptionRepository } from '../../infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionId } from '../../domain/CourseSubscriptionId';

export class DeleteCourseSubscriptionCommand {
  public readonly id: string;
  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

@Injectable({
  dependencies: [
    MongoCourseSubscriptionRepository,
    MongoCourseRepository,
    InMemoryAsyncEventBus,
  ],
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

    const courseSubscription =
      await this.courseSubscriptionFinder.findByIdOrThrow(courseSubscriptionId);

    courseSubscription.delete();

    await this.courseSubscriptionRepository.removeById(courseSubscriptionId);

    this.publishAggregateRootEvents(courseSubscription);

    return;
  }
}
