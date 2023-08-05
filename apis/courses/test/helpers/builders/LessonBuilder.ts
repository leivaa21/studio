import { MAX_LESSON_TITLE_LENGTH } from '@studio/commons';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { Lesson } from '../../../src/contexts/lessons/domain/Lesson';
import { LessonId } from '../../../src/contexts/lessons/domain/LessonId';
import { LessonOrder } from '../../../src/contexts/lessons/domain/LessonOrder';
import { StringMother } from '../object-mother/StringMother';
import { Builder } from './builder';
import { LessonTitle } from '../../../src/contexts/lessons/domain/LessonTitle';
import { LessonContent } from '../../../src/contexts/lessons/domain/LessonContent';

export class LessonBuilder implements Builder<Lesson> {
  private _courseId: CourseId = CourseId.random();

  build(): Lesson {
    return new Lesson({
      id: LessonId.random(),
      courseId: this._courseId,
      order: LessonOrder.of(0),
      title: LessonTitle.of(
        StringMother.random({
          minLength: 1,
          maxLength: MAX_LESSON_TITLE_LENGTH,
        })
      ),
      content: LessonContent.of(StringMother.random()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public withCourseId(courseId: CourseId) {
    this._courseId = courseId;
    return this;
  }
}
