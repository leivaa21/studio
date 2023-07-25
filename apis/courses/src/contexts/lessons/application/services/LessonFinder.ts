import { CourseId } from '../../../courses/domain/CourseId';
import { Lesson } from '../../domain/Lesson';
import { LessonRepository } from '../../domain/LessonRepository';

export class LessonFinder {
  constructor(private readonly lessonRepository: LessonRepository) {}

  public async findByCourseId(courseId: CourseId): Promise<Lesson[]> {
    return await this.lessonRepository.findByCourseId(courseId);
  }
}
