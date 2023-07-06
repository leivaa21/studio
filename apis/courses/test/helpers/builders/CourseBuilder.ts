import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';
import { Course } from '../../../src/contexts/courses/domain/Course';
import { CourseDescription } from '../../../src/contexts/courses/domain/CourseDescription';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { CourseTitle } from '../../../src/contexts/courses/domain/CourseTitle';
import { StringMother } from '../object-mother/StringMother';
import { Builder } from './builder';

export class CourseBuilder implements Builder<Course> {
  private _id: CourseId = CourseId.random();
  private _title: CourseTitle = CourseTitle.of(StringMother.random());
  private _description: CourseDescription = CourseDescription.of(
    StringMother.random()
  );
  private _authorId: AuthorId = AuthorId.random();
  private _createdAt: Date = new Date();

  public build(): Course {
    return new Course({
      id: this._id,
      title: this._title,
      description: this._description,
      authorId: this._authorId,
      createdAt: this._createdAt,
    });
  }
}
