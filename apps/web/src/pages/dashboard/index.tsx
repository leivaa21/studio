import { useRouter } from 'next/router';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useEffect } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { useSubscribedCourses } from '../../hooks/course/useSubscribedCourses';
import { SubscribedCoursesList } from '../../components/courses/subscribed/CoursesList';

export default function AllCourses() {
  const router = useRouter();
  const coursesShown = useSubscribedCourses() || [];

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  return (
    <Fragment>
      <Header />
      <CreatorHeader title="My Subscribed Courses" />
      <div className="row">
        <div className="column">
          <SubscribedCoursesList courses={coursesShown} />
        </div>
      </div>
    </Fragment>
  );
}
