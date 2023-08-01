import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../services/CourseFinder';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';

export class GetPublishedCoursesPaginatedQuery {
  public readonly with?: {
    title?: string;
    tags?: string[];
  };
  public readonly pageSize: number;
  public readonly page: number;

  public constructor(params: {
    pageSize: number;
    page: number;
    with?: {
      title?: string;
      tags?: string[];
    };
  }) {
    this.pageSize = params.pageSize;
    this.page = params.page;
    this.with = params.with;
  }
}

@Injectable({
  dependencies: [MongoCourseRepository],
})
export class GetPublishedCoursesPaginated
  implements QueryHandler<GetPublishedCoursesPaginatedQuery, Course[]>
{
  private readonly courseFinder: CourseFinder;

  public constructor(courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  public async execute(
    query: GetPublishedCoursesPaginatedQuery
  ): Promise<Course[]> {
    const { pageSize, page, with: _with } = query;

    const courses = await this.courseFinder.findPublishedCoursesPaginated({
      pageSize,
      page,
      with: _with,
    });

    return courses;
  }
}
