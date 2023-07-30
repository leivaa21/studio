import { Injectable } from '@studio/dependency-injection';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { LessonRepository } from '../../domain/LessonRepository';
import { LessonFinder } from '../services/LessonFinder';
import { MongoLessonRepository } from '../../infrastructure/persistance/mongo/MongoLessonRepository';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { LessonId } from '../../domain/LessonId';
import { Lesson } from '../../domain/Lesson';
import { LessonNotFoundError } from '../../domain/errors/LessonNotFoundError';
import { LessonOrder } from '../../domain/LessonOrder';
import { UnableToReorderLessonError } from '../../domain/errors/UnableToReorderLessonError';

export class ReorderLessonDownCommand {
  readonly authorId: string;
  readonly lessonId: string;

  public constructor(args: { authorId: string; lessonId: string }) {
    this.authorId = args.authorId;
    this.lessonId = args.lessonId;
  }
}

@Injectable({
  dependencies: [
    MongoLessonRepository,
    MongoCourseRepository,
    InMemoryAsyncEventBus,
  ],
})
export class ReorderLessonDown extends CommandHandler<ReorderLessonDownCommand> {
  private readonly courseFinder: CourseFinder;
  private readonly lessonFinder: LessonFinder;

  public constructor(
    private readonly lessonRepository: LessonRepository,
    courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
    this.lessonFinder = new LessonFinder(lessonRepository);
  }

  public async execute(command: ReorderLessonDownCommand): Promise<void> {
    const lessonId = LessonId.of(command.lessonId);
    const lesson = await this.lessonFinder.findByIdOrThrow(lessonId);

    const authorId = AuthorId.of(command.authorId);

    await this.courseFinder.findAuthoredByIdOrThrow(authorId, lesson.courseId);

    const lessons = await this.lessonFinder.findByCourseId(lesson.courseId);

    if (lesson.order.value === lessons.length - 1) {
      throw UnableToReorderLessonError.lessonIsAlreadyLast(lessonId.value);
    }

    const posteriorLesson = this.getPosteriorLessonFromArray(
      lesson.order,
      lessons
    );

    lesson.moveDown();
    posteriorLesson.moveUp();

    await Promise.all(
      [lesson, posteriorLesson].map((lesson) =>
        this.lessonRepository.update(lesson)
      )
    );
  }

  private getPosteriorLessonFromArray(
    lessonOrder: LessonOrder,
    lessons: Lesson[]
  ): Lesson {
    const posteriorOrder = LessonOrder.posteriorOf(lessonOrder);
    const lesson = lessons.find((lesson) =>
      lesson.order.equals(posteriorOrder)
    );
    if (!lesson)
      throw LessonNotFoundError.searchedByOrderOnArray(
        posteriorOrder.value,
        lessons.map((lesson) => lesson.id.value)
      );
    return lesson;
  }
}
