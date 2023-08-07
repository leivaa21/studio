import { useEffect, useState } from 'react';

import { SubscribedCourseInfoResponse } from '@studio/commons';

import { getSubscribedCourses } from '../../contexts/courses/application/GetSubscribedCourses';
import { getAuthTokenCookie } from '../../lib/cookieUtils';

export function useSubscribedCourses() {
  const [courses, setCourses] = useState<SubscribedCourseInfoResponse[]>();

  useEffect(() => {
    const token = getAuthTokenCookie() || '';

    if (!token) return;

    getSubscribedCourses(token).then((courses) => setCourses(courses));
  }, []);

  return courses;
}
