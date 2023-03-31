import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { Header } from '../../components/header/header';
import {
  clearAuthTokenCookie,
  getAuthTokenCookie,
} from '../../lib/cookieUtils';

export default function Panel() {
  const [token, setToken] = React.useState<string>();
  const router = useRouter();

  useEffect(() => {
    setToken(getAuthTokenCookie() || '');
  }, []);

  return (
    <Fragment>
      <Header />
      <h1>Panel Here!</h1>
      <p>{token}</p>
      <button
        onClick={() => {
          clearAuthTokenCookie();
          router.push('/');
        }}
      >
        logout
      </button>
    </Fragment>
  );
}
