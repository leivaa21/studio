import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';
import { Course } from '../../../src/contexts/courses/domain/Course';
import { CourseDescription } from '../../../src/contexts/courses/domain/CourseDescription';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { CourseTags } from '../../../src/contexts/courses/domain/CourseTags';
import { CourseTitle } from '../../../src/contexts/courses/domain/CourseTitle';
import { CourseTagMother } from '../object-mother/CourseTagMother';
import { StringMother } from '../object-mother/StringMother';
import { Builder } from './builder';

export class CourseBuilder implements Builder<Course> {
  private _id: CourseId = CourseId.random();
  private _title: CourseTitle = CourseTitle.of(StringMother.random());
  private _tags: CourseTags = CourseTagMother.randomTags();
  private _description: CourseDescription = CourseDescription.of(
    StringMother.random()
  );
  private _authorId?: AuthorId;
  private _createdAt: Date = new Date();

  public build(): Course {
    return new Course({
      id: this._id,
      title: this._title,
      tags: this._tags,
      description: this._description,
      authorId: this._authorId || AuthorId.random(),
      createdAt: this._createdAt,
    });
  }

  public withAuthorId(authorId: AuthorId) {
    this._authorId = authorId;
    return this;
  }
}
