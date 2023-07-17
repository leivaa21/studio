import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { AuthorId } from '../../domain/AuthorId';
import { CourseTitle } from '../../domain/CourseTitle';
import { CourseRepository } from '../../domain/CourseRepository';
import { Injectable } from '@studio/dependency-injection';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { CourseId } from '../../domain/CourseId';
import { CourseFinder } from '../services/CourseFinder';
import { Course } from '../../domain/Course';
import { CourseNotFoundError } from '../../domain/errors/CourseNotFoundError';
import { CourseDescription } from '../../domain/CourseDescription';
import { CourseTags } from '../../domain/CourseTags';
import { CourseTag } from '../../domain/CourseTag';

export class UpdateCourseCommand {
  public readonly authorId: string;
  public readonly courseId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly tags: string[];
  constructor(args: {
    authorId: string;
    courseId: string;
    title: string;
    description: string;
    tags: string[];
  }) {
    this.authorId = args.authorId;
    this.courseId = args.courseId;
    this.title = args.title;
    this.description = args.description;
    this.tags = args.tags;
  }
}

@Injectable({
  dependencies: [MongoCourseRepository, InMemoryAsyncEventBus],
})
export class UpdateCourse extends CommandHandler<UpdateCourseCommand> {
  private readonly courseFinder: CourseFinder;
  constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  async execute(command: UpdateCourseCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const courseId = CourseId.of(command.courseId);
    const title = CourseTitle.of(command.title);
    const description = CourseDescription.of(command.description);
    const tags = CourseTags.of(command.tags.map((tag) => CourseTag.of(tag)));

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    this.assertCourseIsAuthoredByUser(course, authorId);

    course.rename(title);
    course.updateDescription(description);
    course.updateTags(tags);

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
