import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { AuthorId } from '../../domain/AuthorId';
import { CourseRepository } from '../../domain/CourseRepository';
import { Injectable } from '@studio/dependency-injection';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { CourseId } from '../../domain/CourseId';
import { CourseFinder } from '../services/CourseFinder';

export class PublishCourseCommand {
  public readonly authorId: string;
  public readonly courseId: string;
  constructor(args: { authorId: string; courseId: string }) {
    this.authorId = args.authorId;
    this.courseId = args.courseId;
  }
}

@Injectable({
  dependencies: [CourseRepository, InMemoryAsyncEventBus],
})
export class PublishCourse extends CommandHandler<PublishCourseCommand> {
  private readonly courseFinder: CourseFinder;
  constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  async execute(command: PublishCourseCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const courseId = CourseId.of(command.courseId);

    const course = await this.courseFinder.findAuthoredByIdOrThrow(
      authorId,
      courseId
    );

    course.publish();

    await this.courseRepository.update(course);

    super.publishAggregateRootEvents(course);

    return;
  }
}
