import { Nullable } from '../../shared/domain/Nullable';
import { AuthorId } from './AuthorId';
import { Course } from './Course';
import { CourseId } from './CourseId';
import { CourseCriteria } from './criteria/CourseCriteria';

export abstract class CourseRepository {
  abstract create(course: Course): Promise<void>;
  abstract matching(criteria: CourseCriteria): Promise<Array<Course>>;
  abstract findById(id: CourseId): Promise<Nullable<Course>>;
  abstract findByAuthor(authorId: AuthorId): Promise<Array<Course>>;
  abstract update(course: Course): Promise<void>;
  abstract deleteByAuthor(authorId: AuthorId): Promise<void>;
}
