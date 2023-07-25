import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { Header } from '../../../components/header/header';
import { CreatorHeader } from '../../../components/creator/header';
import { CoursePreviewNavigator } from '../../../components/creator/course/previewNavigator';
import NewLessonForm from '../../../components/creator/course/lessons/newLessonForm';

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
      <CreatorHeader title="Creator Course View" />
      <div className="row">
        <div className="sidebar">
          <CoursePreviewNavigator courseId={courseId} />
        </div>
        <div className="column">
          <NewLessonForm courseId={courseId} />
        </div>
      </div>
    </Fragment>
  );
}
