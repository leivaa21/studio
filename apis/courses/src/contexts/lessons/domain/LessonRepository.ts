import { Lesson } from './Lesson';

export interface LessonRepository {
  create(lesson: Lesson): Promise<void>;
}
