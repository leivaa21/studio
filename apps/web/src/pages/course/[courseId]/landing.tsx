import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { CreatorHeader } from '../../../components/creator/header';
import { Header } from '../../../components/header/header';
import { CourseContentPreview } from '../../../components/courses/CourseContentPreview';

export default function CoursePreview() {
  const router = useRouter();

  const courseId = router.query.courseId as string;

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router, courseId]);

  return (
    <Fragment>
      <Header />
      <CreatorHeader title="Course Preview" />
      <div className="row">
        <CourseContentPreview courseId={courseId} />
      </div>
    </Fragment>
  );
}
