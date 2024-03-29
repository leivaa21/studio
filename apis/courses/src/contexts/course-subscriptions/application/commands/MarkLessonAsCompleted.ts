import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { Injectable } from '@studio/dependency-injection';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { UserId } from '../../domain/UserId';
import { LessonRepository } from '../../../lessons/domain/LessonRepository';
import { LessonId } from '../../../lessons/domain/LessonId';
import { LessonFinder } from '../../../lessons/application/services/LessonFinder';

export class MarkLessonAsCompletedCommand {
  public readonly lessonId: string;
  public readonly userId: string;
  constructor(args: { lessonId: string; userId: string }) {
    this.lessonId = args.lessonId;
    this.userId = args.userId;
  }
}

@Injectable({
  dependencies: [CourseSubscriptionRepository, LessonRepository, EventBus],
})
export class MarkLessonAsCompleted extends CommandHandler<MarkLessonAsCompletedCommand> {
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;
  private readonly lessonFinder: LessonFinder;

  constructor(
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    lessonRepository: LessonRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
    this.lessonFinder = new LessonFinder(lessonRepository);
  }
  async execute(command: MarkLessonAsCompletedCommand): Promise<void> {
    const lessonId = LessonId.of(command.lessonId);

    const lesson = await this.lessonFinder.findByIdOrThrow(lessonId);

    const userId = UserId.of(command.userId);

    const courseSubscription =
      await this.courseSubscriptionFinder.findByUserAndCourseOrThrow(
        userId,
        lesson.courseId
      );

    courseSubscription.markLessonAsCompleted(lessonId);

    await this.courseSubscriptionRepository.update(courseSubscription);

    this.publishAggregateRootEvents(courseSubscription);

    return;
  }
}
