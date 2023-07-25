import { useRouter } from 'next/router';
import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useEffect, useState } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { CreatorPanel } from '../../components/creator/panel';
import Button from '@studio/ui/components/interactivity/cta/button';
import { getAuthoredCoursesPaginated } from '../../contexts/courses/application/GetAuthoredCoursesPaginated';
import { CourseInfoResponse, CourseTagsRecord } from '@studio/commons';

export default function CreatorDashboard() {
  const router = useRouter();
  const [coursesShown, setCoursesShown] = useState<CourseInfoResponse[]>([]);

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const onFetch = async (title: string, tags: string[]) => {
    const courses = await getAuthoredCoursesPaginated(
      getAuthTokenCookie() || '',
      0,
      25,
      title,
      tags
    );
    setCoursesShown(courses);
  };

  return (
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
            href="/course/new"
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
  );
}
