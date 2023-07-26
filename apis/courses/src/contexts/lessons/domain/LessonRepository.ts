import { CourseId } from '../../courses/domain/CourseId';
import { Nullable } from '../../shared/domain/Nullable';
import { Lesson } from './Lesson';
import { LessonId } from './LessonId';

export interface LessonRepository {
  create(lesson: Lesson): Promise<void>;
  findByCourseId(courseId: CourseId): Promise<Lesson[]>;
  findById(lessonId: LessonId): Promise<Nullable<Lesson>>;
}
