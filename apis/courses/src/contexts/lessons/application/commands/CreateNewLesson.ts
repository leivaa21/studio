import { Injectable } from '@studio/dependency-injection';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { Lesson } from '../../domain/Lesson';
import { LessonRepository } from '../../domain/LessonRepository';
import { LessonTitle } from '../../domain/LessonTitle';
import { MongoLessonRepository } from '../../infrastructure/persistance/mongo/MongoLessonRepository';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { LessonFinder } from '../services/LessonFinder';
import { LessonOrder } from '../../domain/LessonOrder';
import { LessonContent } from '../../domain/LessonContent';

export class CreateNewLessonCommand {
  public readonly authorId: string;
  public readonly courseId: string;
  public readonly title: string;
  public readonly content: string;

  constructor(args: {
    authorId: string;
    courseId: string;
    title: string;
    content: string;
  }) {
    this.authorId = args.authorId;
    this.courseId = args.courseId;
    this.title = args.title;
    this.content = args.content;
  }
}

@Injectable({
  dependencies: [
    MongoLessonRepository,
    MongoCourseRepository,
    InMemoryAsyncEventBus,
  ],
})
export class CreateNewLesson extends CommandHandler<CreateNewLessonCommand> {
  private readonly courseFinder: CourseFinder;
  private readonly lessonFinder: LessonFinder;
  constructor(
    private readonly lessonRepository: LessonRepository,
    courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
    this.lessonFinder = new LessonFinder(lessonRepository);
  }
  public async execute(command: CreateNewLessonCommand): Promise<void> {
    const authorId = AuthorId.of(command.authorId);
    const courseId = CourseId.of(command.courseId);

    await this.courseFinder.findAuthoredByIdOrThrow(authorId, courseId);

    const lessons = await this.lessonFinder.findByCourseId(courseId);

    const order = LessonOrder.of(lessons.length);
    const title = LessonTitle.of(command.title);
    const content = LessonContent.of(command.content);

    const lesson = Lesson.new({ courseId, order, title, content });

    await this.lessonRepository.create(lesson);

    super.publishAggregateRootEvents(lesson);
  }
}
