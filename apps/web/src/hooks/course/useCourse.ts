import { useEffect, useState } from 'react';

import { CourseInfoResponse } from '@studio/commons';

import { getCourseById } from '../../contexts/courses/application/GetCourseById';

export function useCourse(id: string) {
  const [course, setCourse] = useState<CourseInfoResponse>();

  useEffect(() => {
    if (!id) return;
    getCourseById(id).then((course) => setCourse(course));
  }, [id]);

  return course;
}
