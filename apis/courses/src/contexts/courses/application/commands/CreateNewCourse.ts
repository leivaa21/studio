import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { AuthorId } from '../../domain/AuthorId';
import { CourseTitle } from '../../domain/CourseTitle';
import { CourseDescription } from '../../domain/CourseDescription';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { Injectable } from '@studio/dependency-injection';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';

export class CreateNewCourseCommand {
  public readonly authorId: string;
  public readonly title: string;
  public readonly description: string;
  constructor(args: { authorId: string; title: string; description: string }) {
    this.authorId = args.authorId;
    this.title = args.title;
    this.description = args.description;
  }
}

@Injectable({
  dependencies: [MongoCourseRepository, InMemoryAsyncEventBus],
})
export class CreateNewCourse extends CommandHandler<CreateNewCourseCommand> {
  constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
  }
  async execute(command: CreateNewCourseCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const title = CourseTitle.of(command.title);
    const description = CourseDescription.of(command.description);

    const course = Course.new({ authorId, title, description });

    await this.courseRepository.create(course);

    super.publishAggregateRootEvents(course);

    return;
  }
}