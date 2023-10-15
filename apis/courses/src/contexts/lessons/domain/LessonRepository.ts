import { CourseId } from '../../courses/domain/CourseId';
import { Nullable } from '../../shared/domain/Nullable';
import { Lesson } from './Lesson';
import { LessonId } from './LessonId';

export abstract class LessonRepository {
  abstract create(lesson: Lesson): Promise<void>;
  abstract findByCourseId(courseId: CourseId): Promise<Lesson[]>;
  abstract findById(lessonId: LessonId): Promise<Nullable<Lesson>>;
  abstract update(lesson: Lesson): Promise<void>;
  abstract deleteById(lessonId: LessonId): Promise<void>;
  abstract deleteByCourse(courseId: CourseId): Promise<void>;
}
