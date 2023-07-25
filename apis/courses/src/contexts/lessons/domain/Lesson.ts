import { CourseId } from '../../courses/domain/CourseId';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { LessonContent } from './LessonContent';
import { LessonId } from './LessonId';
import { LessonTitle } from './LessonTitle';
import { LessonWasCreatedEvent } from './events/LessonWasCreated';

export interface LessonParams {
  readonly id: LessonId;
  readonly courseId: CourseId;
  readonly title: LessonTitle;
  readonly content: LessonContent;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface LessonPrimitives {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Lesson extends AggregateRoot {
  public readonly id: LessonId;
  public readonly courseId: CourseId;
  private _title: LessonTitle;
  private _content: LessonContent;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(args: LessonParams) {
    super();
    this.id = args.id;
    this.courseId = args.courseId;
    this._title = args.title;
    this._content = args.content;
    this.createdAt = args.createdAt;
    this._updatedAt = args.updatedAt;
  }

  public static new({
    courseId,
    title,
    content,
  }: {
    courseId: CourseId;
    title: LessonTitle;
    content: LessonContent;
  }): Lesson {
    const lessonId = LessonId.random();

    const lessonWasCreatedEvent = LessonWasCreatedEvent.fromPrimitives({
      aggregateId: lessonId.value,
      attributes: {
        courseId: courseId.value,
      },
    });

    const lesson = new Lesson({
      id: lessonId,
      courseId: courseId,
      title: title,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    lesson.commit(lessonWasCreatedEvent);

    return lesson;
  }

  get title(): LessonTitle {
    return this._title;
  }

  get content(): LessonContent {
    return this._content;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public toPrimitives(): LessonPrimitives {
    return {
      id: this.id.value,
      courseId: this.courseId.value,
      title: this.title.value,
      content: this.content.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromPrimitives(args: LessonPrimitives): Lesson {
    return new Lesson({
      id: LessonId.of(args.id),
      courseId: CourseId.of(args.courseId),
      title: LessonTitle.of(args.title),
      content: LessonContent.of(args.content),
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  }
}
