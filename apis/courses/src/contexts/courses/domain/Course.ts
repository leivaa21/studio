import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { Nullable } from '../../shared/domain/Nullable';
import { AuthorId } from './AuthorId';
import { CourseDescription } from './CourseDescription';
import { CourseId } from './CourseId';
import { CourseTag } from './CourseTag';
import { CourseTags } from './CourseTags';
import { CourseTitle } from './CourseTitle';
import { CourseWasCreatedEvent } from './events/CourseWasCreated';
import { CourseWasRenamedEvent } from './events/CourseWasRenamed';

export interface CourseParams {
  readonly id: CourseId;
  readonly authorId: AuthorId;
  readonly title: CourseTitle;
  readonly tags: CourseTags;
  readonly description: CourseDescription;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly publishedAt: Nullable<Date>;
}

export interface CoursePrimitives {
  readonly id: string;
  readonly authorId: string;
  readonly title: string;
  readonly tags: string[];
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly publishedAt: Nullable<Date>;
}

export class Course extends AggregateRoot {
  public readonly id: CourseId;
  public readonly authorId: AuthorId;
  private _title: CourseTitle;
  private _tags: CourseTags;
  private _description: CourseDescription;
  public readonly createdAt: Date;
  private _updatedAt: Date;
  private _publishedAt: Nullable<Date>;

  constructor({
    id,
    authorId,
    title,
    tags,
    description,
    createdAt,
    updatedAt,
    publishedAt,
  }: CourseParams) {
    super();
    this.id = id;
    this.authorId = authorId;
    this._title = title;
    this._tags = tags;
    this._description = description;
    this.createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._publishedAt = publishedAt;
  }

  static new({
    authorId,
    title,
    tags,
    description,
  }: {
    authorId: AuthorId;
    title: CourseTitle;
    tags: CourseTags;
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
      updatedAt: new Date(),
      publishedAt: null,
    });

    course.commit(courseWasCreatedEvent);

    return course;
  }

  public isAuthoredBy(authorId: AuthorId): boolean {
    return this.authorId.value === authorId.value;
  }

  public rename(title: CourseTitle): void {
    if (this._title.equals(title)) return;

    this._title = title;
    this._updatedAt = new Date();

    const renamedEvent = CourseWasRenamedEvent.fromPrimitives({
      aggregateId: this.id.value,
      attributes: {
        title: title.value,
      },
    });

    this.commit(renamedEvent);
  }

  public updateDescription(description: CourseDescription): void {
    if (this._description.equals(description)) return;

    this._description = description;
    this._updatedAt = new Date();
  }

  public updateTags(tags: CourseTags) {
    if (this._tags.equals(tags)) return;

    this._tags = tags;
    this._updatedAt = new Date();
  }

  public get title(): CourseTitle {
    return this._title;
  }

  public get description(): CourseTitle {
    return this._description;
  }

  public get tags(): CourseTags {
    return this._tags;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get publishedAt(): Nullable<Date> {
    return this._publishedAt;
  }

  public static fromPrimitives(coursePrimitives: CoursePrimitives): Course {
    return new Course({
      id: CourseId.of(coursePrimitives.id),
      authorId: AuthorId.of(coursePrimitives.authorId),
      title: CourseTitle.of(coursePrimitives.title),
      tags: CourseTags.of(
        coursePrimitives.tags.map((tag) => CourseTag.of(tag))
      ),
      description: CourseDescription.of(coursePrimitives.description),
      createdAt: coursePrimitives.createdAt,
      updatedAt: coursePrimitives.updatedAt,
      publishedAt: coursePrimitives.publishedAt,
    });
  }

  public toPrimitives(): CoursePrimitives {
    return {
      id: this.id.value,
      authorId: this.authorId.value,
      title: this.title.value,
      tags: this.tags.values,
      description: this.description.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      publishedAt: this.publishedAt,
    };
  }
}
