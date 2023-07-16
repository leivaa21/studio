import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { AuthorId } from './AuthorId';
import { CourseDescription } from './CourseDescription';
import { CourseId } from './CourseId';
import { CourseTag } from './CourseTag';
import { CourseTitle } from './CourseTitle';
import { CourseWasCreatedEvent } from './events/CourseWasCreated';
import { CourseWasRenamedEvent } from './events/CourseWasRenamed';

export interface CourseParams {
  readonly id: CourseId;
  readonly authorId: AuthorId;
  readonly title: CourseTitle;
  readonly tags: CourseTag[];
  readonly description: CourseDescription;
  readonly createdAt: Date;
}

export interface CoursePrimitives {
  readonly id: string;
  readonly authorId: string;
  readonly title: string;
  readonly tags: string[];
  readonly description: string;
  readonly createdAt: Date;
}

export class Course extends AggregateRoot {
  public readonly id: CourseId;
  public readonly authorId: AuthorId;
  private _title: CourseTitle;
  private _tags: CourseTag[];
  private _description: CourseDescription;
  public readonly createdAt: Date;

  constructor({
    id,
    authorId,
    title,
    description,
    createdAt,
    tags,
  }: CourseParams) {
    super();
    this.id = id;
    this.authorId = authorId;
    this._title = title;
    this._tags = tags;
    this._description = description;
    this.createdAt = createdAt;
  }

  static new({
    authorId,
    title,
    tags,
    description,
  }: {
    authorId: AuthorId;
    title: CourseTitle;
    tags: CourseTag[];
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
      tags,
      description,
      createdAt: new Date(),
    });

    course.commit(courseWasCreatedEvent);

    return course;
  }

  public isAuthoredBy(authorId: AuthorId): boolean {
    return this.authorId.equals(authorId);
  }

  public rename(title: CourseTitle): void {
    if (this._title.equals(title)) return;

    this._title = title;

    const renamedEvent = CourseWasRenamedEvent.fromPrimitives({
      aggregateId: this.id.value,
      attributes: {
        title: title.value,
      },
    });

    this.commit(renamedEvent);
  }

  public get title(): CourseTitle {
    return this._title;
  }

  public get description(): CourseTitle {
    return this._description;
  }

  public get tags(): CourseTag[] {
    return this._tags;
  }

  public static fromPrimitives(coursePrimitives: CoursePrimitives): Course {
    return new Course({
      id: CourseId.of(coursePrimitives.id),
      authorId: AuthorId.of(coursePrimitives.authorId),
      title: CourseTitle.of(coursePrimitives.title),
      tags: coursePrimitives.tags.map((tag) => CourseTag.of(tag)),
      description: CourseDescription.of(coursePrimitives.description),
      createdAt: coursePrimitives.createdAt,
    });
  }

  public toPrimitives(): CoursePrimitives {
    return {
      id: this.id.value,
      authorId: this.authorId.value,
      title: this.title.value,
      tags: this.tags.map((tag) => tag.value),
      description: this.description.value,
      createdAt: this.createdAt,
    };
  }
}
