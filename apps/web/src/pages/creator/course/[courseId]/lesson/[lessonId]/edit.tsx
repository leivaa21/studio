import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../../../../../lib/cookieUtils';
import { Header } from '../../../../../../components/header/header';
import { CreatorHeader } from '../../../../../../components/creator/header';
import { CoursePreviewNavigator } from '../../../../../../components/creator/course/previewNavigator';
import EditLessonForm from '../../../../../../components/creator/course/lessons/editLessonForm';
import { PageMetadata } from '../../../../../../components/PageMetadata';

export default function CreatorEditLessonPage() {
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
            <EditLessonForm courseId={courseId} lessonId={lessonId} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
