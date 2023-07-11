import { Course } from './Course';
import { CourseCriteria } from './criteria/CourseCriteria';

export interface CourseRepository {
  create(course: Course): Promise<void>;
  matching(criteria: CourseCriteria): Promise<Array<Course>>;
}
