import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Fragment } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { GetUserResponse } from '@studio/commons';

import { Header } from '../../components/header/header';
import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { CreatorHeader } from '../../components/creator/header';
import { UserProfileView } from '../../components/profile/userView';
import { PageMetadata } from '../../components/PageMetadata';
import { internalApiClient } from '../../lib/InternalApiClient';

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<GetUserResponse>();

  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    const token = getAuthTokenCookie();
    if (!token) return;
    try {
      const user = await internalApiClient.getCurrentUser(token);
      setUser(user);
    } catch (err) {
      showBoundary(err);
    }
  }, [showBoundary]);

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
    fetchData();
  }, [router, fetchData]);

  if (!user) return <Fragment />;

  return (
    <PageMetadata title="Studio | Profile">
      <Fragment>
        <Header />
        <CreatorHeader title="Profile" />
        <div className="row">
          <div className="column">
            <UserProfileView userId={user.id || ''} />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
