import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { AuthorId } from '../../domain/AuthorId';
import { CourseRepository } from '../../domain/CourseRepository';
import { Injectable } from '@studio/dependency-injection';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseId } from '../../domain/CourseId';
import { CourseFinder } from '../services/CourseFinder';
import { Course } from '../../domain/Course';
import { CourseNotFoundError } from '../../domain/errors/CourseNotFoundError';
import { CourseTags } from '../../domain/CourseTags';
import { CourseTag } from '../../domain/CourseTag';
import { RabbitMQEventBus } from '../../../shared/infrastructure/EventBus/RabbitMQEventBus';

export class UpdateCourseTagsCommand {
  public readonly authorId: string;
  public readonly courseId: string;
  public readonly tags: string[];
  constructor(args: { authorId: string; courseId: string; tags: string[] }) {
    this.authorId = args.authorId;
    this.courseId = args.courseId;
    this.tags = args.tags;
  }
}

@Injectable({
  dependencies: [MongoCourseRepository, RabbitMQEventBus],
})
export class UpdateCourseTags extends CommandHandler<UpdateCourseTagsCommand> {
  private readonly courseFinder: CourseFinder;
  constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  async execute(command: UpdateCourseTagsCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const courseId = CourseId.of(command.courseId);
    const tags = CourseTags.of(command.tags.map((tag) => CourseTag.of(tag)));

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    this.assertCourseIsAuthoredByUser(course, authorId);

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
