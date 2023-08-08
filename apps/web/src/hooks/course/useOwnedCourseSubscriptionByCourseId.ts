import { useEffect, useState } from 'react';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { getOwnedCourseSubscriptionByCourseId } from '../../contexts/course-subscription/application/GetOwnedCourseSubscriptionByCourseId';
import { CourseSubscriptionInfoResponse } from '@studio/commons';

export function useOwnedCourseSubscriptionByCourseId(courseId: string) {
  const [courseSubscription, setCourseSubscription] =
    useState<CourseSubscriptionInfoResponse>();

  useEffect(() => {
    if (!courseId) return;
    getOwnedCourseSubscriptionByCourseId(
      courseId,
      getAuthTokenCookie() || ''
    ).then((courseSubscription) => setCourseSubscription(courseSubscription));
  }, [courseId]);

  return courseSubscription;
}
