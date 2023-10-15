import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../services/CourseFinder';

export class GetPublishedCoursesFilteredQuery {
  public readonly with?: {
    title?: string;
    tags?: string[];
  };

  public constructor(params: {
    with?: {
      title?: string;
      tags?: string[];
    };
  }) {
    this.with = params.with;
  }
}

@Injectable({
  dependencies: [CourseRepository],
})
export class GetPublishedCoursesFiltered
  implements QueryHandler<GetPublishedCoursesFilteredQuery, Course[]>
{
  private readonly courseFinder: CourseFinder;

  public constructor(courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  public async execute(
    query: GetPublishedCoursesFilteredQuery
  ): Promise<Course[]> {
    const { with: _with } = query;

    const courses = await this.courseFinder.findPublishedCoursesFiltered({
      with: _with,
    });

    return courses;
  }
}
