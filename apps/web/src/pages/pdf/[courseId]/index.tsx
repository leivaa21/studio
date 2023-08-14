import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { CreatorHeader } from '../../../components/creator/header';
import { Header } from '../../../components/header/header';
import { checkIfUserIsSubscribedToCourse } from '../../../contexts/course-subscription/application/CheckIfUserIsSubscribedToCourse';
import { getOwnedCourseSubscriptionByCourseId } from '../../../contexts/course-subscription/application/GetOwnedCourseSubscriptionByCourseId';

export default function CoursePreview() {
  const router = useRouter();

  const courseId = router.query.courseId as string;

  const [isCompleted, setIfCompleted] = useState<boolean>(false);

  const hasSubscriptionCompleted = useCallback(
    async (authToken: string) => {
      const isSubscribed = await checkIfUserIsSubscribedToCourse(
        courseId,
        authToken
      );
      if (!isSubscribed) return false;
      const subscription = await getOwnedCourseSubscriptionByCourseId(
        courseId,
        authToken
      );
      if (!subscription.completed) return false;

      return true;
    },
    [courseId]
  );

  useEffect(() => {
    if (!courseId) return;
    const authToken = getAuthTokenCookie() || '';
    if (authToken === '') router.push('/');
    hasSubscriptionCompleted(authToken).then((isCompleted) => {
      if (!isCompleted) {
        router.push('/dashboard');
        return;
      }
      setIfCompleted(true);
    });
  }, [courseId, router, hasSubscriptionCompleted]);

  return (
    <Fragment>
      <Header />
      <CreatorHeader title="Course Completed Diploma" />
      <div className="row">{isCompleted ? <h2>Pdf viewer</h2> : undefined}</div>
    </Fragment>
  );
}
