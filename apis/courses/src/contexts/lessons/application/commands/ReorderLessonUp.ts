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

export class ReorderLessonUpCommand {
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
export class ReorderLessonUp extends CommandHandler<ReorderLessonUpCommand> {
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

  public async execute(command: ReorderLessonUpCommand): Promise<void> {
    const lessonId = LessonId.of(command.lessonId);
    const lesson = await this.lessonFinder.findByIdOrThrow(lessonId);

    const authorId = AuthorId.of(command.authorId);

    await this.courseFinder.findAuthoredByIdOrThrow(authorId, lesson.courseId);

    const lessons = await this.lessonFinder.findByCourseId(lesson.courseId);

    if (lesson.order.isFirst) {
      throw UnableToReorderLessonError.lessonIsAlreadyFirst(lessonId.value);
    }

    const previousLesson = this.getPreviousLessonFromArray(
      lesson.order,
      lessons
    );

    lesson.moveUp();
    previousLesson.moveDown();

    await Promise.all(
      [lesson, previousLesson].map((lesson) =>
        this.lessonRepository.update(lesson)
      )
    );
  }

  private getPreviousLessonFromArray(
    lessonOrder: LessonOrder,
    lessons: Lesson[]
  ): Lesson {
    const previousOrder = LessonOrder.previousOf(lessonOrder);
    const lesson = lessons.find(
      (lesson) => lesson.order.value === previousOrder.value
    );
    if (!lesson)
      throw LessonNotFoundError.searchedByOrderOnArray(
        lessonOrder.value,
        lessons.map((lesson) => lesson.id.value)
      );
    return lesson;
  }
}
