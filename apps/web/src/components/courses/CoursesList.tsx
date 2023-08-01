import { CourseInfoResponse } from '@studio/commons';
import { CourseCard } from './CourseCard';

export function CourseList({ courses }: { courses: CourseInfoResponse[] }) {
  return (
    <div>
      {courses.map((course) => (
        <CourseCard key={`course-${course.id}`} course={course} />
      ))}
    </div>
  );
}
