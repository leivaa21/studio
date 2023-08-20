import { useRouter } from 'next/router';
import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';
import { useErrorBoundary } from 'react-error-boundary';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { CreatorPanel } from '../../components/creator/panel';
import Button from '@studio/ui/components/interactivity/cta/button';
import { getAuthoredCoursesFiltered } from '../../contexts/courses/application/GetAuthoredCoursesFiltered';
import { CourseInfoResponse, CourseTagsRecord } from '@studio/commons';
import { PageMetadata } from '../../components/PageMetadata';

export default function CreatorDashboard() {
  const router = useRouter();
  const [coursesShown, setCoursesShown] = useState<CourseInfoResponse[]>([]);

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const { showBoundary } = useErrorBoundary();

  const onFetch = useCallback(
    async (title: string, tags: string[]) => {
      const token = getAuthTokenCookie();
      if (!token) return;
      try {
        const courses = await getAuthoredCoursesFiltered(token, title, tags);
        setCoursesShown(courses);
      } catch (err) {
        showBoundary(err);
      }
    },
    [showBoundary]
  );

  return (
    <PageMetadata title="Studio | Creator Dashboard">
      <Fragment>
        <Header />
        <CreatorHeader title="Creator Dashboard" />
        <div className="row">
          <div className="sidebar">
            <Button
              Type="Primary"
              Size="Small"
              Label="Create new course"
              Link
              href="/creator/course/new"
            />
            <CourseSearcher
              onFetch={onFetch}
              tags={Object.keys(CourseTagsRecord)}
            />
          </div>
          <div className="column">
            <CreatorPanel courses={coursesShown} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
