import { useErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useEffect, useState } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { CourseInfoResponse, CourseTagsRecord } from '@studio/commons';
import { CourseList } from '../../components/courses/CoursesList';
import { getPublishedCoursesFiltered } from '../../contexts/courses/application/GetPublishedCoursesFiltered';
import { PageMetadata } from '../../components/PageMetadata';

export default function AllCourses() {
  const router = useRouter();
  const [coursesShown, setCoursesShown] = useState<CourseInfoResponse[]>([]);

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const onFetch = async (title: string, tags: string[]) => {
    try {
      const courses = await getPublishedCoursesFiltered(title, tags);
      setCoursesShown(courses);
    } catch (err) {
      showBoundary(err);
    }
  };

  return (
    <PageMetadata title="Studio | Course Searcher">
      <Fragment>
        <Header />
        <CreatorHeader title="All Courses" />
        <div className="row">
          <div className="sidebar">
            <CourseSearcher
              onFetch={onFetch}
              tags={Object.keys(CourseTagsRecord)}
            />
          </div>
          <div className="column">
            <CourseList courses={coursesShown} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
