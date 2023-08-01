import { CourseId } from '../../courses/domain/CourseId';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { LessonContent } from './LessonContent';
import { LessonId } from './LessonId';
import { LessonOrder } from './LessonOrder';
import { LessonTitle } from './LessonTitle';
import { UnableToReorderLessonError } from './errors/UnableToReorderLessonError';
import { LessonWasCreatedEvent } from './events/LessonWasCreated';
import { LessonWasDeletedEvent } from './events/LessonWasDeleted';

export interface LessonParams {
  readonly id: LessonId;
  readonly courseId: CourseId;
  readonly order: LessonOrder;
  readonly title: LessonTitle;
  readonly content: LessonContent;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface LessonPrimitives {
  readonly id: string;
  readonly courseId: string;
  readonly order: number;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Lesson extends AggregateRoot {
  public readonly id: LessonId;
  public readonly courseId: CourseId;
  private _order: LessonOrder;
  private _title: LessonTitle;
  private _content: LessonContent;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(args: LessonParams) {
    super();
    this.id = args.id;
    this.courseId = args.courseId;
    this._order = args.order;
    this._title = args.title;
    this._content = args.content;
    this.createdAt = args.createdAt;
    this._updatedAt = args.updatedAt;
  }

  public static new({
    courseId,
    order,
    title,
    content,
  }: {
    courseId: CourseId;
    order: LessonOrder;
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
      courseId,
      order,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    lesson.commit(lessonWasCreatedEvent);

    return lesson;
  }

  public delete(): void {
    const lessonWasDeletedEvent = LessonWasDeletedEvent.fromPrimitives({
      aggregateId: this.id.value,
      attributes: {
        courseId: this.courseId.value,
      },
    });
    this.commit(lessonWasDeletedEvent);
  }

  get order(): LessonOrder {
    return this._order;
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

  public moveUp(): void {
    if (this.order.isFirst) {
      throw UnableToReorderLessonError.lessonIsAlreadyFirst(this.id.value);
    }
    this._order = LessonOrder.previousOf(this.order);
  }

  public moveDown(): void {
    this._order = LessonOrder.posteriorOf(this.order);
  }

  public updateTitle(title: LessonTitle): void {
    if (this.title.equals(title)) return;

    this._title = title;
    this._updatedAt = new Date();
  }

  public updateContent(content: LessonContent): void {
    if (this.content.equals(content)) return;

    this._content = content;
    this._updatedAt = new Date();
  }

  public toPrimitives(): LessonPrimitives {
    return {
      id: this.id.value,
      courseId: this.courseId.value,
      order: this.order.value,
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
      order: LessonOrder.of(args.order),
      title: LessonTitle.of(args.title),
      content: LessonContent.of(args.content),
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  }
}
