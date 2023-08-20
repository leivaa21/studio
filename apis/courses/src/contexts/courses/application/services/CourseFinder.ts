import { AuthorId } from '../../domain/AuthorId';
import { Course } from '../../domain/Course';
import { CourseId } from '../../domain/CourseId';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseCriteria } from '../../domain/criteria/CourseCriteria';
import { CourseNotFoundError } from '../../domain/errors/CourseNotFoundError';

export class CourseFinder {
  constructor(private readonly repository: CourseRepository) {}

  public async findAuthoredCoursesFiltered(params: {
    authorId: AuthorId;
    with?: {
      title?: string;
      tags?: string[];
    };
  }): Promise<Course[]> {
    const criteria = CourseCriteria.fromAuthorWithFilters({
      authorId: params.authorId,
      filters: {
        includingOnTitle: params.with?.title,
        havingTags: params.with?.tags,
      },
    });

    return this.repository.matching(criteria);
  }

  public async findPublishedCoursesPaginated(params: {
    pageSize: number;
    page: number;
    with?: {
      title?: string;
      tags?: string[];
    };
  }): Promise<Course[]> {
    const criteria = CourseCriteria.paginatedPublishedWithFilters({
      pageSize: params.pageSize,
      page: params.page,
      filters: {
        includingOnTitle: params.with?.title,
        havingTags: params.with?.tags,
      },
    });

    return this.repository.matching(criteria);
  }

  public async findSubscribedWithFilters(params: {
    courseIds: CourseId[];
    with?: { title?: string; tags?: string[] };
  }): Promise<Course[]> {
    const criteria = CourseCriteria.subscribedCoursesFiltered({
      courseIds: params.courseIds,
      filters: {
        includingOnTitle: params.with?.title,
        havingTags: params.with?.tags,
      },
    });

    return this.repository.matching(criteria);
  }

  public async findByIdOrThrow(id: CourseId): Promise<Course> {
    const course = await this.repository.findById(id);

    if (!course) {
      throw CourseNotFoundError.searchedById(id.value);
    }

    return course;
  }

  public async findAuthoredByIdOrThrow(
    authorId: AuthorId,
    courseId: CourseId
  ): Promise<Course> {
    const course = await this.repository.findById(courseId);

    if (!course?.isAuthoredBy(authorId)) {
      throw CourseNotFoundError.searchedById(courseId.value);
    }

    return course;
  }
}
