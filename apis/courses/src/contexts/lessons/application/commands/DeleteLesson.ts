import { Injectable } from '@studio/dependency-injection';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { LessonRepository } from '../../domain/LessonRepository';
import { LessonFinder } from '../services/LessonFinder';
import { MongoLessonRepository } from '../../infrastructure/persistance/mongo/MongoLessonRepository';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { LessonId } from '../../domain/LessonId';
import { RabbitMQEventBus } from '../../../shared/infrastructure/EventBus/RabbitMQEventBus';

export class DeleteLessonCommand {
  public readonly authorId: string;
  public readonly lessonId: string;

  constructor(args: { authorId: string; lessonId: string }) {
    this.authorId = args.authorId;
    this.lessonId = args.lessonId;
  }
}

@Injectable({
  dependencies: [
    MongoLessonRepository,
    MongoCourseRepository,
    RabbitMQEventBus,
  ],
})
export class DeleteLesson extends CommandHandler<DeleteLessonCommand> {
  private readonly lessonFinder: LessonFinder;
  private readonly courseFinder: CourseFinder;

  constructor(
    private readonly lessonRepository: LessonRepository,
    courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.lessonFinder = new LessonFinder(lessonRepository);
    this.courseFinder = new CourseFinder(courseRepository);
  }

  public async execute(command: DeleteLessonCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const lessonId = LessonId.of(command.lessonId);

    const lesson = await this.lessonFinder.findByIdOrThrow(lessonId);

    await this.courseFinder.findAuthoredByIdOrThrow(authorId, lesson.courseId);

    lesson.delete();

    await this.lessonRepository.deleteById(lesson.id);

    this.publishAggregateRootEvents(lesson);
  }
}
