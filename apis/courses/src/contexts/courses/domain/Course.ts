import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { AuthorId } from './AuthorId';
import { CourseDescription } from './CourseDescription';
import { CourseId } from './CourseId';
import { CourseTitle } from './CourseTitle';
import { CourseWasCreatedEvent } from './events/CourseWasCreated';

export interface CourseParams {
  readonly id: CourseId;
  readonly authorId: AuthorId;
  readonly title: CourseTitle;
  readonly description: CourseDescription;
  readonly createdAt: Date;
}

export interface CoursePrimitives {
  readonly id: string;
  readonly authorId: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
}

export class Course extends AggregateRoot {
  public readonly id: CourseId;
  public readonly authorId: AuthorId;
  private _title: CourseTitle;
  private _description: CourseDescription;
  public readonly createdAt: Date;

  constructor({ id, authorId, title, description, createdAt }: CourseParams) {
    super();
    this.id = id;
    this.authorId = authorId;
    this._title = title;
    this._description = description;
    this.createdAt = createdAt;
  }

  static new({
    authorId,
    title,
    description,
  }: {
    authorId: AuthorId;
    title: CourseTitle;
    description: CourseDescription;
  }): Course {
    const courseId = CourseId.random();

    const courseWasCreatedEvent = CourseWasCreatedEvent.fromPrimitives({
      aggregateId: courseId.value,
      attributes: {
        authorId: authorId.value,
      },
    });

    const course = new Course({
      id: courseId,
      authorId,
      title,
      description,
      createdAt: new Date(),
    });

    course.commit(courseWasCreatedEvent);

    return course;
  }

  public get title(): CourseTitle {
    return this._title;
  }

  public get description(): CourseTitle {
    return this._description;
  }

  public static fromPrimitives(coursePrimitives: CoursePrimitives): Course {
    return new Course({
      id: CourseId.of(coursePrimitives.id),
      authorId: AuthorId.of(coursePrimitives.authorId),
      title: CourseTitle.of(coursePrimitives.title),
      description: CourseDescription.of(coursePrimitives.description),
      createdAt: coursePrimitives.createdAt,
    });
  }

  public toPrimitives(): CoursePrimitives {
    return {
      id: this.id.value,
      authorId: this.authorId.value,
      title: this.title.value,
      description: this.description.value,
      createdAt: this.createdAt,
    };
  }
}
