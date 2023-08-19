import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../../../../../lib/cookieUtils';
import { CreatorHeader } from '../../../../../../components/creator/header';
import { Header } from '../../../../../../components/header/header';
import { PreviewLesson } from '../../../../../../components/creator/course/lessons/PreviewLesson';
import { CoursePreviewNavigator } from '../../../../../../components/creator/course/previewNavigator';
import { PageMetadata } from '../../../../../../components/PageMetadata';

export default function CreatorCoursePreviewPage() {
  const router = useRouter();

  const courseId = router.query.courseId as string;
  const lessonId = router.query.lessonId as string;

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
    if (!courseId || !lessonId) return;
  }, [router, courseId, lessonId]);

  return (
    <PageMetadata title="Studio | Creator Dashboard">
      <Fragment>
        <Header />
        <CreatorHeader title="Creator Course View" />
        <div className="row">
          <div className="sidebar">
            <CoursePreviewNavigator courseId={courseId} />
          </div>
          <div className="column">
            <PreviewLesson lessonId={lessonId} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
