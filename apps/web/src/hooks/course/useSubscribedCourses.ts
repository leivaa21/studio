import { useEffect, useState } from 'react';

import { SubscribedCourseInfoResponse } from '@studio/commons';

import { getSubscribedCourses } from '../../contexts/courses/application/GetSubscribedCourses';
import { getAuthTokenCookie } from '../../lib/cookieUtils';

export function useSubscribedCourses({
  title,
  tags,
}: {
  title?: string;
  tags?: string[];
}) {
  const [courses, setCourses] = useState<SubscribedCourseInfoResponse[]>();

  useEffect(() => {
    const token = getAuthTokenCookie() || '';

    if (!token) return;

    getSubscribedCourses({ authorizationToken: token, title, tags }).then(
      (courses) => setCourses(courses)
    );
  }, [title, tags]);

  return courses;
}
