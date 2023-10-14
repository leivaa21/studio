import { Injectable } from '@studio/dependency-injection';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { LessonRepository } from '../../domain/LessonRepository';
import { LessonTitle } from '../../domain/LessonTitle';
import { MongoLessonRepository } from '../../infrastructure/persistance/mongo/MongoLessonRepository';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { LessonId } from '../../domain/LessonId';
import { LessonFinder } from '../services/LessonFinder';
import { LessonContent } from '../../domain/LessonContent';
import { RabbitMQEventBus } from '../../../shared/infrastructure/EventBus/RabbitMQEventBus';

export class UpdateLessonCommand {
  public readonly authorId: string;
  public readonly lessonId: string;
  public readonly title: string;
  public readonly content: string;

  constructor(args: {
    authorId: string;
    lessonId: string;
    title: string;
    content: string;
  }) {
    this.authorId = args.authorId;
    this.lessonId = args.lessonId;
    this.title = args.title;
    this.content = args.content;
  }
}

@Injectable({
  dependencies: [
    MongoLessonRepository,
    MongoCourseRepository,
    RabbitMQEventBus,
  ],
})
export class UpdateLesson extends CommandHandler<UpdateLessonCommand> {
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
  public async execute(command: UpdateLessonCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const lessonId = LessonId.of(command.lessonId);

    const lesson = await this.lessonFinder.findByIdOrThrow(lessonId);

    await this.courseFinder.findAuthoredByIdOrThrow(authorId, lesson.courseId);

    const title = LessonTitle.of(command.title);
    const content = LessonContent.of(command.content);

    lesson.updateTitle(title);
    lesson.updateContent(content);

    await this.lessonRepository.update(lesson);

    super.publishAggregateRootEvents(lesson);
  }
}
