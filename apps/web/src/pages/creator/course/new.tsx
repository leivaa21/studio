import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { Header } from '../../../components/header/header';
import { CreatorHeader } from '../../../components/creator/header';
import CreateNewCourseForm from '../../../components/creator/course/newCourseForm';

export default function CreateNewCourseView() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  return (
    <Fragment>
      <Header />
      <CreatorHeader title="Create new course" />
      <div className="row">
        <div className="column">
          <CreateNewCourseForm />
        </div>
      </div>
    </Fragment>
  );
}