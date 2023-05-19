import { useRouter } from 'next/router';
import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useEffect } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { CreatorPanel } from '../../components/creator/panel';
import Button from '@studio/ui/components/interactivity/cta/button';

const possibleCourseTags = [
  'Backend',
  'Frontend',
  'Personal',
  'Habits',
  'Development',
  'Paradigm',
];

export default function CreatorDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const onFetch = async () => {
    //
  };

  return (
    <Fragment>
      <Header />
      <div className="row">
        <div className="sidebar">
          <Button Type="Secondary" Size="Small" Label="Create new course" />
          <CourseSearcher onFetch={onFetch} tags={possibleCourseTags} />
        </div>
        <div className="column">
          <CreatorHeader />
          <CreatorPanel />
        </div>
      </div>
    </Fragment>
  );
}
