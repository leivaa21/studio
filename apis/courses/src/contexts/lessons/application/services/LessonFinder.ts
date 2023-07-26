import { CourseId } from '../../../courses/domain/CourseId';
import { Lesson } from '../../domain/Lesson';
import { LessonId } from '../../domain/LessonId';
import { LessonRepository } from '../../domain/LessonRepository';
import { LessonNotFoundError } from '../../domain/errors/LessonNotFoundError';

export class LessonFinder {
  constructor(private readonly lessonRepository: LessonRepository) {}

  public async findByCourseId(courseId: CourseId): Promise<Lesson[]> {
    return await this.lessonRepository.findByCourseId(courseId);
  }

  public async findByIdOrThrow(lessonId: LessonId): Promise<Lesson> {
    const lesson = await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      throw LessonNotFoundError.searchedById(lessonId.value);
    }

    return lesson;
  }
}
