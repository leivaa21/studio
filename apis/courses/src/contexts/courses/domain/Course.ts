import { AuthorId } from './AuthorId';
import { CourseDescription } from './CourseDescription';
import { CourseId } from './CourseId';
import { CourseTitle } from './CourseTitle';

export interface CourseParams {
  readonly id: CourseId;
  readonly authorId: AuthorId;
  readonly title: CourseTitle;
  readonly description: CourseDescription;
  readonly createdAt: Date;
}

export class Course {
  public readonly id: CourseId;
  public readonly authorId: AuthorId;
  private _title: CourseTitle;
  private _description: CourseDescription;
  public readonly createdAt: Date;

  constructor({ id, authorId, title, description, createdAt }: CourseParams) {
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
    const course = new Course({
      id: CourseId.random(),
      authorId,
      title,
      description,
      createdAt: new Date(),
    });

    return course;
  }

  get title(): CourseTitle {
    return this._title;
  }

  get description(): CourseTitle {
    return this._description;
  }
}
