import { useEffect, useState } from 'react';

import { checkIfUserIsSubscribedToCourse } from '../../contexts/course-subscription/application/CheckIfUserIsSubscribedToCourse';
import { getAuthTokenCookie } from '../../lib/cookieUtils';

export function useCheckIfUserIsAlreadySubscribedToCourse(courseId: string) {
  const [isSubscribed, setIsSubscribed] = useState<boolean>();

  useEffect(() => {
    if (!courseId) return;
    checkIfUserIsSubscribedToCourse(courseId, getAuthTokenCookie() || '').then(
      (isSubscribed) => setIsSubscribed(isSubscribed)
    );
  }, [courseId]);

  return isSubscribed;
}
