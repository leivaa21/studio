import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { Header } from '../../components/header/header';
import { getAuthTokenCookie } from '../../lib/cookieUtils';

export default function Panel() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
  }, [router]);

  return (
    <Fragment>
      <Header />
      <h1>Panel Here!</h1>
    </Fragment>
  );
}
