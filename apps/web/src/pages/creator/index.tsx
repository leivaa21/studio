import { useRouter } from 'next/router';
import { CourseSearcher } from '@studio/ui/components/search/coursesSearcher';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { Fragment, useEffect, useState } from 'react';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { CreatorPanel } from '../../components/creator/panel';
import Button from '@studio/ui/components/interactivity/cta/button';
import { CreateNewCourseModal } from '../../components/creator/create-modal';
import { getAuthoredCoursesPaginated } from '../../contexts/courses/application/GetAuthoredCoursesPaginated';

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
  const [creatorModalIsShown, setCreatorModalIsShownTo] =
    useState<boolean>(false);

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  const onFetch = async () => {
    const courses = await getAuthoredCoursesPaginated(
      getAuthTokenCookie() || '',
      1,
      3,
      ''
    );
    console.log(courses);
  };

  return (
    <Fragment>
      <Header />
      <div className="row">
        <div className="sidebar">
          <Button
            Type="Secondary"
            Size="Small"
            Label="Create new course"
            onClick={() => setCreatorModalIsShownTo(true)}
          />
          <CourseSearcher onFetch={onFetch} tags={possibleCourseTags} />
        </div>
        <div className="column">
          <CreatorHeader />
          <CreatorPanel />
        </div>
      </div>
      <CreateNewCourseModal
        isShown={creatorModalIsShown}
        closeFunction={() => {
          setCreatorModalIsShownTo(false);
        }}
      />
    </Fragment>
  );
}
