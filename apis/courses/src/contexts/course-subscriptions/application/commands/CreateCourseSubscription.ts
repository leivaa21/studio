import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { Injectable } from '@studio/dependency-injection';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { CourseId } from '../../../courses/domain/CourseId';
import { UserId } from '../../domain/UserId';
import { CourseSubscription } from '../../domain/CourseSubscription';
import { InvalidCourseSubscriptionError } from '../../domain/errors/InvalidCourseSubscriptionError';
import { MongoCourseSubscriptionRepository } from '../../infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';

export class CreateCourseSubscriptionCommand {
  public readonly courseId: string;
  public readonly userId: string;
  constructor(args: { courseId: string; userId: string }) {
    this.courseId = args.courseId;
    this.userId = args.userId;
  }
}

@Injectable({
  dependencies: [
    MongoCourseSubscriptionRepository,
    CourseRepository,
    InMemoryAsyncEventBus,
  ],
})
export class CreateCourseSubscription extends CommandHandler<CreateCourseSubscriptionCommand> {
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;
  private readonly courseFinder: CourseFinder;

  constructor(
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
    this.courseFinder = new CourseFinder(courseRepository);
  }
  async execute(command: CreateCourseSubscriptionCommand): Promise<void> {
    const courseId = CourseId.of(command.courseId);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    if (!course.isPublished) {
      throw InvalidCourseSubscriptionError.causeCourseIsNotPublished(
        courseId.value
      );
    }

    const userId = UserId.of(command.userId);

    const alreadyPersistedSubscription =
      await this.courseSubscriptionFinder.findByUserAndCourse(userId, courseId);

    if (alreadyPersistedSubscription) {
      throw InvalidCourseSubscriptionError.causeAlreadyExistForUserAndCourse(
        userId.value,
        courseId.value
      );
    }

    const courseSubscription = CourseSubscription.new({ userId, courseId });

    await this.courseSubscriptionRepository.create(courseSubscription);

    this.publishAggregateRootEvents(courseSubscription);

    return;
  }
}
