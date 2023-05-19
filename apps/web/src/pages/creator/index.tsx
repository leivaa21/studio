import { useRouter } from 'next/router';
import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useEffect } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { CreatorPanel } from '../../components/creator/panel';

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
        <CourseSearcher onFetch={onFetch} tags={possibleCourseTags} />
        <div className="column">
          <CreatorHeader />
          <CreatorPanel />
        </div>
      </div>
    </Fragment>
  );
}
