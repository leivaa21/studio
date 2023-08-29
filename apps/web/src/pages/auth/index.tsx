import { useRouter } from 'next/router';
import React, { Fragment, useEffect } from 'react';
import {
  clearAuthTokenCookie,
  setAuthTokenCookie,
} from '../../lib/cookieUtils';

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    clearAuthTokenCookie();
    setAuthTokenCookie(router.query.token as string);

    router.push('/courses');
  }, [router, router.query.token]);

  return <Fragment></Fragment>;
}
