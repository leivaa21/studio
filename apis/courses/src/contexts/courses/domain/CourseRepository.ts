import { Nullable } from '../../shared/domain/Nullable';
import { Course } from './Course';
import { CourseId } from './CourseId';
import { CourseCriteria } from './criteria/CourseCriteria';

export interface CourseRepository {
  create(course: Course): Promise<void>;
  matching(criteria: CourseCriteria): Promise<Array<Course>>;
  findById(id: CourseId): Promise<Nullable<Course>>;
  update(course: Course): Promise<void>;
}
