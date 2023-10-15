import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { Lesson } from '../../domain/Lesson';
import { LessonRepository } from '../../domain/LessonRepository';
import { CourseId } from '../../../courses/domain/CourseId';
import { LessonFinder } from '../services/LessonFinder';

export class GetLessonsByCourseQuery {
  public readonly courseId: string;

  constructor(args: { courseId: string }) {
    this.courseId = args.courseId;
  }
}

@Injectable({
  dependencies: [LessonRepository],
})
export class GetLessonsByCourse
  implements QueryHandler<GetLessonsByCourseQuery, Lesson[]>
{
  private readonly lessonFinder: LessonFinder;

  public constructor(lessonRepository: LessonRepository) {
    this.lessonFinder = new LessonFinder(lessonRepository);
  }
  public async execute(query: GetLessonsByCourseQuery): Promise<Lesson[]> {
    const courseId = CourseId.of(query.courseId);

    const lessons = await this.lessonFinder.findByCourseId(courseId);

    return lessons;
  }
}
