import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { AuthorId } from '../../domain/AuthorId';
import { CourseTitle } from '../../domain/CourseTitle';
import { CourseRepository } from '../../domain/CourseRepository';
import { Injectable } from '@studio/dependency-injection';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { CourseId } from '../../domain/CourseId';
import { CourseFinder } from '../services/CourseFinder';
import { Course } from '../../domain/Course';
import { CourseNotFoundError } from '../../domain/errors/CourseNotFoundError';

export class RenameCourseCommand {
  public readonly authorId: string;
  public readonly courseId: string;
  public readonly title: string;

  constructor(args: { authorId: string; courseId: string; title: string }) {
    this.authorId = args.authorId;
    this.courseId = args.courseId;
    this.title = args.title;
  }
}

@Injectable({
  dependencies: [CourseRepository, InMemoryAsyncEventBus],
})
export class RenameCourse extends CommandHandler<RenameCourseCommand> {
  private readonly courseFinder: CourseFinder;
  constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  async execute(command: RenameCourseCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const courseId = CourseId.of(command.courseId);
    const title = CourseTitle.of(command.title);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    this.assertCourseIsAuthoredByUser(course, authorId);

    course.rename(title);

    await this.courseRepository.update(course);

    super.publishAggregateRootEvents(course);

    return;
  }

  private assertCourseIsAuthoredByUser(
    course: Course,
    authorId: AuthorId
  ): void {
    if (!course.isAuthoredBy(authorId)) {
      throw CourseNotFoundError.searchedById(course.id.value);
    }
  }
}
