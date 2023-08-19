import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { Header } from '../../components/header/header';
import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { CreatorHeader } from '../../components/creator/header';
import { useCurrentUser } from '../../hooks/user/useCurrentUser';
import { UserProfileView } from '../../components/profile/userView';
import { PageMetadata } from '../../components/PageMetadata';

export default function Panel() {
  const router = useRouter();

  const user = useCurrentUser();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  return (
    <PageMetadata title="Studio | Profile">
      <Fragment>
        <Header />
        <CreatorHeader title="Profile" />
        <div className="row">
          <div className="column">
            <UserProfileView userId={user?.id || ''} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
