import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';
import { CourseTagsRecord } from '@studio/commons';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { useSubscribedCourses } from '../../hooks/course/useSubscribedCourses';
import { SubscribedCoursesList } from '../../components/courses/subscribed/CoursesList';
import { PageMetadata } from '../../components/PageMetadata';

export default function AllCourses() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>();
  const coursesShown = useSubscribedCourses({ title, tags }) || [];

  const onFetch = useCallback(async (title: string, tags: string[]) => {
    setTitle(title);
    setTags(tags);
  }, []);

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
