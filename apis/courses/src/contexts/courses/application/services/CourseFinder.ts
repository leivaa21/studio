import { AuthorId } from '../../domain/AuthorId';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseCriteria } from '../../domain/criteria/CourseCriteria';

export class CourseFinder {
  constructor(private readonly repository: CourseRepository) {}

  public async findCoursesPaginated(params: {
    authorId: AuthorId;
    pageSize: number;
    page: number;
    with?: {
      title?: string;
      tags?: string[];
    };
  }): Promise<Course[]> {
    const criteria = CourseCriteria.paginatedFromAuthorWithFilters({
      authorId: params.authorId,
      pageSize: params.pageSize,
      page: params.page,
      filters: {
        includingOnTitle: params.with?.title,
        havingTags: params.with?.tags,
      },
    });

    return this.repository.matching(criteria);
  }
}
