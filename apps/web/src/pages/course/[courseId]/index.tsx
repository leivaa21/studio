import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { Header } from '../../../components/header/header';
import { CreatorCoursePreview } from '../../../components/creator/course/preview';

export default function CreatorCoursePreviewPage() {
  const router = useRouter();

  const courseId = router.query.courseId as string;

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
    if (!courseId) return;
  }, [router, courseId]);

  return (
    <Fragment>
      <Header />
      <CreatorCoursePreview courseId={courseId} />
    </Fragment>
  );
}
