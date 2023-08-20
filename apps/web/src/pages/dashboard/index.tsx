import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useErrorBoundary } from 'react-error-boundary';

import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';
import {
  CourseTagsRecord,
  SubscribedCourseInfoResponse,
} from '@studio/commons';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { SubscribedCoursesList } from '../../components/courses/subscribed/CoursesList';
import { PageMetadata } from '../../components/PageMetadata';
import { getSubscribedCourses } from '../../contexts/courses/application/GetSubscribedCourses';

export default function AllCourses() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const [coursesShown, setCoursesShown] = useState<
    SubscribedCourseInfoResponse[]
  >([]);
  const { showBoundary } = useErrorBoundary();

  const onFetch = useCallback(
    async (title: string, tags: string[]) => {
      const token = getAuthTokenCookie();
      if (!token) return;

      try {
        const courses = await getSubscribedCourses({
          authorizationToken: token,
          title,
          tags,
        });
        setCoursesShown(courses);
      } catch (err) {
        showBoundary(err);
      }
    },
    [showBoundary]
  );

  return (
    <PageMetadata title="Studio | Dashboard">
      <Fragment>
        <Header />
        <CreatorHeader title="My Subscribed Courses" />
        <div className="row">
          <div className="sidebar">
            <CourseSearcher
              onFetch={onFetch}
              tags={Object.keys(CourseTagsRecord)}
            />
          </div>
          <div className="column">
            <SubscribedCoursesList courses={coursesShown} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
