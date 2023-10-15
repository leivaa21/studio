import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../services/CourseFinder';
import { CourseId } from '../../domain/CourseId';

export class GetCourseByIdQuery {
  public readonly courseId: string;

  public constructor(params: { courseId: string }) {
    this.courseId = params.courseId;
  }
}

@Injectable({
  dependencies: [CourseRepository],
})
export class GetCourseById implements QueryHandler<GetCourseByIdQuery, Course> {
  private readonly courseFinder: CourseFinder;

  public constructor(courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  public async execute(query: GetCourseByIdQuery): Promise<Course> {
    const courseId = CourseId.of(query.courseId);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    return course;
  }
}
