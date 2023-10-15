import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { AuthorId } from '../../domain/AuthorId';
import { CourseRepository } from '../../domain/CourseRepository';
import { Injectable } from '@studio/dependency-injection';
import { CourseId } from '../../domain/CourseId';
import { CourseFinder } from '../services/CourseFinder';
import { Course } from '../../domain/Course';
import { CourseNotFoundError } from '../../domain/errors/CourseNotFoundError';
import { CourseDescription } from '../../domain/CourseDescription';

export class UpdateCourseDescriptionCommand {
  public readonly authorId: string;
  public readonly courseId: string;
  public readonly description: string;
  constructor(args: {
    authorId: string;
    courseId: string;
    description: string;
  }) {
    this.authorId = args.authorId;
    this.courseId = args.courseId;
    this.description = args.description;
  }
}

@Injectable({
  dependencies: [CourseRepository, EventBus],
})
export class UpdateCourseDescription extends CommandHandler<UpdateCourseDescriptionCommand> {
  private readonly courseFinder: CourseFinder;
  constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  async execute(command: UpdateCourseDescriptionCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const courseId = CourseId.of(command.courseId);
    const description = CourseDescription.of(command.description);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    this.assertCourseIsAuthoredByUser(course, authorId);

    course.updateDescription(description);

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
