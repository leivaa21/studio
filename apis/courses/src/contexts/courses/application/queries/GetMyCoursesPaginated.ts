import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { AuthorId } from '../../domain/AuthorId';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../services/CourseFinder';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';

export class GetMyCoursesPaginatedQuery {
  public readonly authorId: string;
  public readonly with?: {
    title?: string;
    tags?: string[];
  };
  public readonly pageSize: number;
  public readonly page: number;

  public constructor(params: {
    authorId: string;
    pageSize: number;
    page: number;
    with?: {
      title?: string;
      tags?: string[];
    };
  }) {
    this.authorId = params.authorId;
    this.pageSize = params.pageSize;
    this.page = params.page;
    this.with = params.with;
  }
}

@Injectable({
  dependencies: [MongoCourseRepository],
})
export class GetMyCoursesPaginated
  implements QueryHandler<GetMyCoursesPaginatedQuery, Course[]>
{
  private readonly courseFinder: CourseFinder;

  public constructor(courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  public async execute(query: GetMyCoursesPaginatedQuery): Promise<Course[]> {
    const authorId = AuthorId.of(query.authorId);
    const { pageSize, page, with: _with } = query;

    const courses = await this.courseFinder.findCoursesPaginated({
      authorId,
      pageSize,
      page,
      with: _with,
    });

    return courses;
  }
}
