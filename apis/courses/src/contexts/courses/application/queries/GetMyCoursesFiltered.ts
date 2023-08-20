import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { AuthorId } from '../../domain/AuthorId';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../services/CourseFinder';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';

export class GetMyCoursesFilteredQuery {
  public readonly authorId: string;
  public readonly with?: {
    title?: string;
    tags?: string[];
  };
  public constructor(params: {
    authorId: string;
    with?: {
      title?: string;
      tags?: string[];
    };
  }) {
    this.authorId = params.authorId;
    this.with = params.with;
  }
}

@Injectable({
  dependencies: [MongoCourseRepository],
})
export class GetMyCoursesFiltered
  implements QueryHandler<GetMyCoursesFilteredQuery, Course[]>
{
  private readonly courseFinder: CourseFinder;

  public constructor(courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  public async execute(query: GetMyCoursesFilteredQuery): Promise<Course[]> {
    const authorId = AuthorId.of(query.authorId);
    const { with: _with } = query;

    const courses = await this.courseFinder.findAuthoredCoursesFiltered({
      authorId,
      with: _with,
    });

    return courses;
  }
}
