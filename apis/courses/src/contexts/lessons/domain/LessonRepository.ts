import { CourseId } from '../../courses/domain/CourseId';
import { Lesson } from './Lesson';

export interface LessonRepository {
  create(lesson: Lesson): Promise<void>;
  findByCourseId(courseId: CourseId): Promise<Lesson[]>;
}
