import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { getAuthTokenCookie } from '../../../../../lib/cookieUtils';
import { CreatorHeader } from '../../../../../components/creator/header';
import { Header } from '../../../../../components/header/header';
import { LessonContentView } from '../../../../../components/courses/subscribed/lessons/LessonContentView';
import { PageMetadata } from '../../../../../components/PageMetadata';

export default function LessonPreview() {
  const router = useRouter();

  const courseId = router.query.courseId as string;
  const lessonId = router.query.lessonId as string;

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router, lessonId, courseId]);

  return (
    <PageMetadata title="Studio | Lesson">
      <Fragment>
        <Header />
        <CreatorHeader title="Lesson View" />
        <div className="row">
          <LessonContentView courseId={courseId} lessonId={lessonId} />
        </div>
      </Fragment>
    </PageMetadata>
  );
}
